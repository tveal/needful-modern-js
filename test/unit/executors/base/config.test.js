import { expect } from 'chai';
import { omit } from 'lodash';
import {
  NPM_BASE_CONFIG,
} from '../../../../src/executors/base/config';

describe('base executor', () => {
  describe('NPM_BASE_CONFIG', () => {
    it('should have proper config', async () => {
      expect(omit(NPM_BASE_CONFIG, 'babelrc')).to.deep.equal({
        depsDev: {
          versioned: [
            "@babel/core@7.14.2",
            "@babel/plugin-transform-runtime@7.13.15",
            "@babel/preset-env@7.14.1",
            "@babel/register@7.13.16",
            "babel-plugin-istanbul@6.0.0",
            "better-npm-run@0.1.1",
            "chai@4.3.4",
            "mocha@8.4.0",
            "nyc@15.1.0",
          ],
          list: [
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
        },
        deps: {
          versioned: [
            "lodash@4.17.21",
          ],
          list: [
            "lodash",
          ],
        },
        packageJson: {
          scripts: {
            test: 'better-npm-run test',
            'test:int': 'better-npm-run test:int',
          },
          betterScripts: {
            test: {
              command: 'nyc mocha --require @babel/register "./test/unit/**/*.test.js"',
              env: {
                NODE_ENV: 'test',
              },
            },
            'test:int': {
              command: 'nyc mocha --require @babel/register "./test/int/**/*.test.js"',
              env: {
                NODE_ENV: 'test',
              },
            },
          },
        },
      });
      expect(NPM_BASE_CONFIG.babelrc).to.deep.equal({
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
      });
    });
  });
});
