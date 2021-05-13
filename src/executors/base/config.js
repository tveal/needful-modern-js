import { pick } from 'lodash';
import {
  scripts,
  betterScripts,
  devDependencies,
  dependencies,
} from '../../../package.json';

const toVersioned = (deps) => Object.keys(deps).map(key => (`${key}@${deps[key].replace(/\^/g, '')}`));

const base = {
  devDependencies: [
    "@babel/core",
    "@babel/plugin-transform-runtime",
    "@babel/preset-env",
    "@babel/register",
    "babel-plugin-istanbul",
    "better-npm-run",
    "chai",
    "mocha",
    "nyc",
  ],
  dependencies: [
    "lodash",
  ],
  scripts: [
    'test',
    'test:int',
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
    betterScripts,
  },
  babelrc: {
    "presets": [
      [
        "@babel/env",
        {
          "targets": {
            "node": "14"
          }
        }
      ]
    ],
    "plugins": [
      "@babel/plugin-transform-runtime"
    ],
    "env": {
      "test": {
        "plugins": [
          "istanbul"
        ]
      }
    }
  },
};
