import { pick } from 'lodash';
import eslintrc from '../../../.eslintrc';
import babelrc from '../../../.babelrc';
import nycrc from '../../../nyc.config';
import rootPackageJson, {
  scripts,
  devDependencies,
  dependencies,
} from '../../../package.json';

const toVersioned = deps => Object.keys(deps).map(key => (`${key}@${deps[key].replace(/\^/g, '')}`));

const base = {
  devDependencies: [
    // babel + test
    '@babel/core',
    '@babel/plugin-transform-runtime',
    '@babel/preset-env',
    '@babel/register',
    'babel-plugin-istanbul',
    'better-npm-run',
    'chai',
    'mocha',
    'nyc',
    'sinon',
    'sinon-chai',
    // linting
    '@babel/eslint-parser',
    '@babel/eslint-plugin',
    'eslint',
    'eslint-config-airbnb-base',
    'eslint-formatter-pretty',
    'eslint-plugin-import',
    'husky',
    'lint-staged',
  ],
  dependencies: [
    '@babel/runtime',
    'lodash',
  ],
  scripts: [
    'test',
    'test:int',
    // linting
    'lint',
    'lint:js',
    'lint:staged',
    'pretest',
  ],
};

export const NPM_BASE_CONFIG = {
  depsDev: {
    versioned: toVersioned(pick(devDependencies, base.devDependencies)),
    list: base.devDependencies,
  },
  deps: {
    versioned: toVersioned(pick(dependencies, base.dependencies)),
    list: base.dependencies,
  },
  packageJson: {
    scripts: {
      ...pick(scripts, base.scripts),
      clean: 'rm -rf .nyc_output/ coverage/',
    },
    ...pick(rootPackageJson, [
      'betterScripts',
      'husky',
      'lint-staged',
    ]),
  },
  // files
  eslintrc,
  babelrc,
  nycrc,
  testHelper: [
    'import chai from \'chai\';',
    'import sinonChai from \'sinon-chai\';',
    '',
    'chai.use(sinonChai);',
    '',
  ].join('\n'),
  testUnit: [
    'import { expect } from \'chai\';',
    'import { greetings } from \'../../src\';',
    '',
    'describe(\'greetings\', () => {',
    '  it(\'should return greetings\', () => {',
    '    expect(greetings(\'Tester\')).to.equal(\'Hello Tester!\');',
    '  });',
    '});',
    '',
  ].join('\n'),
  testInt: [
    'import { expect } from \'chai\';',
    '',
    'describe(\'replace me!\', () => {',
    '  it(\'should do something useful\', () => {',
    '    // TODO: make real integration test',
    '    expect(true).to.be.true;',
    '  });',
    '});',
    '',
  ].join('\n'),
  srcIndex: [ // eslint-disable-next-line no-template-curly-in-string
    'export const greetings = recipient => `Hello ${recipient}!`;',
    '',
    'const main = () => {',
    '  console.log(greetings(\'World\'));',
    '};',
    '',
    'main();',
    '',
  ].join('\n'),
};
