import { pick } from 'lodash';
import eslintrc from '../../../.eslintrc';
import babelrc from '../../../.babelrc';
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
    scripts: pick(scripts, base.scripts),
    ...pick(rootPackageJson, [
      'betterScripts',
      'husky',
      'lint-staged',
    ]),
  },
  eslintrc,
  babelrc,
};
