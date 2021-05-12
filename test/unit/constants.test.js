import { expect } from 'chai';
import {
  DEV_DEPENDENCIES,
  DEPENDENCIES,
  BABELRC_CONTENT,
  PKG_CONFIG,
} from '../../src/constants';

describe('constants', () => {
  describe('DEV_DEPENDENCIES', () => {
    it('should have versioned packages', async () => {
      expect(DEV_DEPENDENCIES).to.deep.equal([
        "@babel/core@7.14.0",
        "@babel/plugin-transform-runtime@7.13.15",
        "@babel/preset-env@7.14.1",
        "@babel/register@7.13.16",
        "babel-plugin-istanbul@6.0.0",
        "better-npm-run@0.1.1",
        "chai@4.3.4",
        "mocha@8.4.0",
        "nyc@15.1.0",
      ]);
    });
  });
  describe('DEPENDENCIES', () => {
    it('should have versioned packages', async () => {
      expect(DEPENDENCIES).to.deep.equal([
        "lodash@4.17.21",
      ]);
    });
  });
  describe('BABELRC_CONTENT', () => {
    it('should have proper content', async () => {
      expect(JSON.parse(BABELRC_CONTENT.toString('utf8'))).to.deep.equal({
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
  describe('PKG_SCRIPTS', () => {
    it('should have proper scripts', async () => {
      expect(PKG_CONFIG).to.deep.equal({
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
      });
    });
  });
});
