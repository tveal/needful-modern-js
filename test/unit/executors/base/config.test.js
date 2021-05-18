import { expect } from 'chai';
import { omit } from 'lodash';
import {
  NPM_BASE_CONFIG,
} from '../../../../src/executors/base/config';

describe('base executor', () => {
  describe('NPM_BASE_CONFIG', () => {
    it('should have proper config', async () => {
      expect(omit(NPM_BASE_CONFIG, [
        'babelrc',
        'eslintrc',
        'nycrc',
        'testHelper',
        'testUnit',
        'testInt',
        'srcIndex',
      ])).to.deep.equal({
        depsDev: {
          versioned: [
            '@babel/core@7.14.2',
            '@babel/plugin-transform-runtime@7.13.15',
            '@babel/preset-env@7.14.1',
            '@babel/register@7.13.16',
            'babel-plugin-istanbul@6.0.0',
            'better-npm-run@0.1.1',
            'chai@4.3.4',
            'mocha@8.4.0',
            'nyc@15.1.0',
            'sinon@10.0.0',
            'sinon-chai@3.6.0',
            // linting
            '@babel/eslint-parser@7.14.3',
            '@babel/eslint-plugin@7.13.16',
            'eslint@7.26.0',
            'eslint-config-airbnb-base@14.2.1',
            'eslint-formatter-pretty@4.0.0',
            'eslint-plugin-import@2.23.2',
            'husky@6.0.0',
            'lint-staged@11.0.0',
          ],
          list: [
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
        },
        deps: {
          versioned: [
            'lodash@4.17.21',
          ],
          list: [
            'lodash',
          ],
        },
        packageJson: {
          'scripts': {
            'clean': 'rm -rf .nyc_output/ coverage/',
            'test': 'better-npm-run test',
            'test:int': 'better-npm-run test:int',
            // linting
            'lint': 'npm run lint:js',
            'lint:js': 'eslint --fix --format=node_modules/eslint-formatter-pretty .',
            'lint:staged': 'lint-staged',
            'pretest': 'npm run clean && npm run lint',
          },
          'betterScripts': {
            'test': {
              command: 'nyc mocha --require @babel/register "./test/unit/**/*.test.js"',
              env: {
                NODE_ENV: 'test',
              },
            },
            'test:int': {
              command: 'mocha --require @babel/register "./test/int/**/*.test.js"',
              env: {
                NODE_ENV: 'test',
              },
            },
          },
          'lint-staged': {
            '*.js': 'eslint',
          },
          'husky': {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          },
        },
      });
      expect(NPM_BASE_CONFIG.babelrc).to.deep.equal({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                node: '14',
              },
            },
          ],
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
        ],
        env: {
          test: {
            plugins: [
              'istanbul',
            ],
          },
        },
      });
      expect(NPM_BASE_CONFIG.eslintrc).to.deep.equal({
        parser: '@babel/eslint-parser',
        extends: 'airbnb-base',
        plugins: [],
        env: {
          node: true,
          mocha: true,
          commonjs: true,
        },
        parserOptions: {
          ecmaVersion: 6,
          sourceType: 'module',
        },
        rules: {
          'arrow-parens': ['error', 'as-needed'],
          'linebreak-style': 0,
          'max-len': [1, 140, 2, { ignoreComments: true, ignoreStrings: true }],
          'quote-props': [1, 'consistent-as-needed'],
          'no-cond-assign': [2, 'except-parens'],
          'space-infix-ops': 0,
          'no-unused-vars': [1, { vars: 'local', args: 'none' }],
          'default-case': 0,
          'no-else-return': 0,
          'no-param-reassign': 0,
          'comma-dangle': 1,
          'indent': 1,
          'object-curly-spacing': 1,
          'arrow-body-style': 1,
          'no-console': 0,
          'prefer-template': 1,
          'import/no-unresolved': 1,
          'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test/**/*.js'] }],
          'import/prefer-default-export': 0,
          'global-require': 1,
          'no-underscore-dangle': 0,
          'new-cap': 0,
          'no-use-before-define': 0,
          'no-useless-escape': 0,
          'no-unused-expressions': 0,
          'class-methods-use-this': 0,
        },
        globals: {},
      });
      expect(NPM_BASE_CONFIG.nycrc).to.deep.equal({
        'lines': 100,
        'statements': 100,
        'functions': 100,
        'branches': 100,
        'include': [
          'src/**/*.js',
        ],
        'exclude': [
          'test/**/*.test.js',
        ],
        'require': [
          '@babel/register',
          './test/helper.js',
        ],
        'reporter': [
          'text',
          'json-summary',
          'lcov',
          'html',
          'text-summary',
        ],
        'sourceMap': false,
        'instrument': false,
        'cache': false,
        'check-coverage': true,
        'all': true,
      });
      expect(NPM_BASE_CONFIG.testHelper).to.deep.equal([
        'import chai from \'chai\';',
        'import sinonChai from \'sinon-chai\';',
        '',
        'chai.use(sinonChai);',
        '',
      ].join('\n'));
      expect(NPM_BASE_CONFIG.testUnit.split('\n')).to.deep.equal([
        'import { expect } from \'chai\';',
        'import { greetings } from \'../../src\';',
        '',
        'describe(\'greetings\', () => {',
        '  it(\'should return greetings\', () => {',
        '    expect(greetings(\'Tester\')).to.equal(\'Hello Tester!\');',
        '  });',
        '});',
        '',
      ]);
      expect(NPM_BASE_CONFIG.testInt.split('\n')).to.deep.equal([
        'import { expect } from \'chai\';',
        '',
        'describe(\'replace me!\', () => {',
        '  it(\'should do something useful\', () => {',
        '    // TODO: make real integration test',
        '    expect(true).to.be.true;',
        '  });',
        '});',
        '',
      ]);
      expect(NPM_BASE_CONFIG.srcIndex.split('\n')).to.deep.equal([
        // eslint-disable-next-line no-template-curly-in-string
        'export const greetings = recipient => `Hello ${recipient}!`;',
        '',
        'const main = () => {',
        '  console.log(greetings(\'World\'));',
        '};',
        '',
        'main();',
        '',
      ]);
    });
  });
});
