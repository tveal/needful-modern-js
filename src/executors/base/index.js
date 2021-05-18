import { get, isEmpty, merge } from 'lodash';
import { log } from '../../utils/logger';
import { ProjectConnector } from '../../connector';
import { NPM_BASE_CONFIG } from './config';

export default async ({ rootDir, argv={} }) => {
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

  await Promise.all([
    project.saveFile('.babelrc', JSON.stringify(NPM_BASE_CONFIG.babelrc, null, 2)),
    project.saveFile('.eslintrc', JSON.stringify(NPM_BASE_CONFIG.eslintrc, null, 2)),
  ]);
};

const getExistingDepsToDelete = config => [
  ...Object.keys(get(config, 'devDependencies', {})),
  ...Object.keys(get(config, 'dependencies', {})),
].filter((dep = '') => (
  [
    ...NPM_BASE_CONFIG.depsDev.list,
    ...NPM_BASE_CONFIG.deps.list,
  ].includes(dep)
  || dep.startsWith('babel-')
  || dep.startsWith('@babel/')
));
