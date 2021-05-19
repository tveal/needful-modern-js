import { basename } from 'path';
import { get, isEmpty, merge } from 'lodash';
import { log } from '../../utils/logger';
import { ProjectConnector } from '../../connector';
import { NPM_BASE_CONFIG } from './config';

export default async ({ rootDir, argv = {} }) => {
  const project = new ProjectConnector(rootDir);

  const depsToDelete = getExistingDepsToDelete(project.config);
  if (!isEmpty(depsToDelete)) {
    log.info('Deleting existing dependencies: %j', depsToDelete);
    project.bash(`npm rm ${depsToDelete.join(' ')}`);
    project.loadPackageConfig();
  }

  const depType = argv.latest ? 'list' : 'versioned';
  project.bash([
    `npm i -D ${NPM_BASE_CONFIG.depsDev[depType].join(' ')}`,
    `npm i ${NPM_BASE_CONFIG.deps[depType].join(' ')}`,
  ]);
  project.loadPackageConfig();

  merge(project.config, NPM_BASE_CONFIG.packageJson);
  project.savePackageConfig();

  const filePromises = [
    project.saveFile('.babelrc', JSON.stringify(NPM_BASE_CONFIG.babelrc, null, 2)),
    project.saveFile('.eslintrc', JSON.stringify(NPM_BASE_CONFIG.eslintrc, null, 2)),
    project.saveFile('.nycrc.json', JSON.stringify(NPM_BASE_CONFIG.nycrc, null, 2)),
    project.saveFile('test/helper.js', NPM_BASE_CONFIG.testHelper),
  ];

  if (!project.hasFile('test/unit/') && !project.hasFile('src/')) {
    filePromises.push(
      project.saveFile('test/unit/index.test.js', NPM_BASE_CONFIG.testUnit),
      project.saveFile('test/int/index.test.js', NPM_BASE_CONFIG.testInt),
      project.saveFile('src/index.js', NPM_BASE_CONFIG.srcIndex),
    );
  }

  const readmeFilename = 'README.md';
  const readmeContent = '\nGenerated with [@needful/modern-js](https://github.com/tveal/needful-modern-js) 😎\n';
  if (!project.hasFile(readmeFilename)) {
    await project.saveFile(readmeFilename, `# ${basename(rootDir)}\n`);
    filePromises.push(project.appendToFile(readmeFilename, readmeContent));
  } else if (!(await project.loadFile(readmeFilename)).includes(readmeContent)) {
    filePromises.push(project.appendToFile(readmeFilename, readmeContent));
  }

  await Promise.all(filePromises);

  log.info('Project setup complete! %s', rootDir);
};

const getExistingDepsToDelete = config => [
  ...Object.keys(get(config, 'devDependencies', {})),
  ...Object.keys(get(config, 'dependencies', {})),
].filter(dep => (
  [
    ...NPM_BASE_CONFIG.depsDev.list,
    ...NPM_BASE_CONFIG.deps.list,
  ].includes(dep)
  || dep.startsWith('babel-')
  || dep.startsWith('@babel/')
));
