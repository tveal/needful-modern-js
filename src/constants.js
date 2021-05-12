import { pick } from 'lodash';
import { readFileSync } from 'fs';
import {
  scripts,
  betterScripts,
  devDependencies,
  dependencies,
} from '../package.json';

const toVersioned = (deps) => Object.keys(deps).map(key => (`${key}@${deps[key].replace(/\^/g, '')}`));
const rootDir = `${__dirname.split('/src/')[0]}/..`;

export const DEV_DEPENDENCIES = toVersioned(pick(devDependencies, [
  "@babel/core",
  "@babel/plugin-transform-runtime",
  "@babel/preset-env",
  "@babel/register",
  "babel-plugin-istanbul",
  "better-npm-run",
  "chai",
  "mocha",
  "nyc",
]));

export const DEPENDENCIES = toVersioned(pick(dependencies, [
  "lodash",
]));

export const BABELRC_CONTENT = readFileSync(`${rootDir}/.babelrc`);

export const PKG_CONFIG = {
  scripts: pick(scripts, ['test', 'test:int']),
  betterScripts,
};
