import { expect } from 'chai';
import { TestFileSystem } from '../../../fixtures';
import baseInstall from '../../../../src/tasks/base';

const BASE_DEV_DEP_CMD = [
  'npm i -D',
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
  '@babel/eslint-parser@7.14.3',
  '@babel/eslint-plugin@7.13.16',
  'eslint@7.26.0',
  'eslint-config-airbnb-base@14.2.1',
  'eslint-formatter-pretty@4.0.0',
  'eslint-plugin-import@2.23.2',
  'husky@6.0.0',
  'lint-staged@11.0.0',
].join(' ');

const BASE_DEV_DEP_CMD_NO_VLOCK = [
  'npm i -D',
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
  '@babel/eslint-parser',
  '@babel/eslint-plugin',
  'eslint',
  'eslint-config-airbnb-base',
  'eslint-formatter-pretty',
  'eslint-plugin-import',
  'husky',
  'lint-staged',
].join(' ');

const BASE_DEP_CMD = 'npm i lodash@4.17.21';
const BASE_DEP_CMD_NO_VLOCK = 'npm i lodash';

const BASH_OPTIONS = {
  encoding: 'utf8',
  shell: '/bin/bash',
  stdio: 'inherit',
  cwd: '/tmp',
};

describe('src/tasks/base/index.js', () => {
  afterEach(() => {
    TestFileSystem.reset();
  });
  it('should init new npm package and seed with base config', async () => {
    TestFileSystem.use();

    const uow = {
      rootDir: '/tmp',
      argv: {},
    };

    await baseInstall(uow);

    expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
      '/tmp',
      '/tmp/.babelrc',
      '/tmp/.eslintrc',
      '/tmp/.nycrc.json',
      '/tmp/README.md',
      '/tmp/package.json',
      '/tmp/src',
      '/tmp/src/index.js',
      '/tmp/test',
      '/tmp/test/helper.js',
      '/tmp/test/int',
      '/tmp/test/int/index.test.js',
      '/tmp/test/unit',
      '/tmp/test/unit/index.test.js',
    ].sort());
    // console.log(JSON.stringify(TestFileSystem.cmdHistory, null, 2));
    expect(TestFileSystem.cmdHistory).to.deep.equal([
      {
        cmd: 'npm init -y',
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEV_DEP_CMD,
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEP_CMD,
        options: BASH_OPTIONS,
      },
    ]);
  });
  it('should seed without version locking', async () => {
    TestFileSystem.use();

    const uow = {
      rootDir: '/tmp',
      argv: {
        latest: true,
      },
    };

    await baseInstall(uow);

    expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
      '/tmp',
      '/tmp/.babelrc',
      '/tmp/.eslintrc',
      '/tmp/.nycrc.json',
      '/tmp/README.md',
      '/tmp/package.json',
      '/tmp/src',
      '/tmp/src/index.js',
      '/tmp/test',
      '/tmp/test/helper.js',
      '/tmp/test/int',
      '/tmp/test/int/index.test.js',
      '/tmp/test/unit',
      '/tmp/test/unit/index.test.js',
    ].sort());
    // console.log(JSON.stringify(TestFileSystem.cmdHistory, null, 2));
    expect(TestFileSystem.cmdHistory).to.deep.equal([
      {
        cmd: 'npm init -y',
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEV_DEP_CMD_NO_VLOCK,
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEP_CMD_NO_VLOCK,
        options: BASH_OPTIONS,
      },
    ]);
  });
  it('should skip src and test starters when existing', async () => {
    TestFileSystem.use()
      .addFile('/tmp/src/', true)
      .addFile('/tmp/test/unit/', true);

    const uow = {
      rootDir: '/tmp',
      argv: {
        latest: true,
      },
    };

    await baseInstall(uow);

    expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
      '/tmp',
      '/tmp/.babelrc',
      '/tmp/.eslintrc',
      '/tmp/.nycrc.json',
      '/tmp/README.md',
      '/tmp/package.json',
      '/tmp/src/', // existing
      '/tmp/test',
      '/tmp/test/helper.js',
      '/tmp/test/unit/',
    ].sort());
    // console.log(JSON.stringify(TestFileSystem.cmdHistory, null, 2));
    expect(TestFileSystem.cmdHistory).to.deep.equal([
      {
        cmd: 'npm init -y',
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEV_DEP_CMD_NO_VLOCK,
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEP_CMD_NO_VLOCK,
        options: BASH_OPTIONS,
      },
    ]);
  });
  it('should append message to existing readme', async () => {
    TestFileSystem.use()
      .addFile('/tmp/README.md', '# tmp\n');

    const uow = {
      rootDir: '/tmp',
      argv: {},
    };

    await baseInstall(uow);

    expect(TestFileSystem.files['/tmp/README.md'].split('\n')).to.deep.equal([
      '# tmp',
      '',
      'Generated with [@needful/modern-js](https://github.com/tveal/needful-modern-js) 😎',
      '',
    ]);
  });
  it('should leave existing readme untouched if generated message already exists', async () => {
    const originalReadme = [
      '# tmp',
      '',
      'Generated with [@needful/modern-js](https://github.com/tveal/needful-modern-js) 😎',
      '',
    ].join('\n');
    TestFileSystem.use()
      .addFile('/tmp/README.md', originalReadme);

    const uow = {
      rootDir: '/tmp',
      argv: {},
    };

    await baseInstall(uow);

    expect(TestFileSystem.files['/tmp/README.md']).to.deep.equal(originalReadme);
  });
  it('should delete-and-replace existing dependencies', async () => {
    TestFileSystem.use()
      .addFile('/tmp/package.json', JSON.stringify({
        name: 'tmp',
        version: '1.0.0',
        description: '',
        main: 'index.js',
        scripts: {
          test: 'echo "Error: no test specified" && exit 1',
        },
        keywords: [],
        author: '',
        license: 'ISC',
        devDependencies: {
          '@babel/core': '6.0.1',
          '@babel/fake': '6.4.2',
          'other': '1.0.0',
        },
        dependencies: {
          lodash: '2.12.3',
        },
      }));

    const uow = {
      rootDir: '/tmp',
      argv: {},
    };

    await baseInstall(uow);

    expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
      '/tmp',
      '/tmp/.babelrc',
      '/tmp/.eslintrc',
      '/tmp/.nycrc.json',
      '/tmp/README.md',
      '/tmp/package.json',
      '/tmp/src',
      '/tmp/src/index.js',
      '/tmp/test',
      '/tmp/test/helper.js',
      '/tmp/test/int',
      '/tmp/test/int/index.test.js',
      '/tmp/test/unit',
      '/tmp/test/unit/index.test.js',
    ].sort());
    // console.log(JSON.stringify(TestFileSystem.cmdHistory, null, 2));
    expect(TestFileSystem.cmdHistory).to.deep.equal([
      {
        cmd: 'npm rm @babel/core @babel/fake lodash',
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEV_DEP_CMD,
        options: BASH_OPTIONS,
      },
      {
        cmd: BASE_DEP_CMD,
        options: BASH_OPTIONS,
      },
    ]);
  });
  it('should not break for missing argv prop', async () => {
    TestFileSystem.use();

    const uow = {
      rootDir: '/tmp',
      // argv: {},
    };

    await baseInstall(uow);

    expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
      '/tmp',
      '/tmp/.babelrc',
      '/tmp/.eslintrc',
      '/tmp/.nycrc.json',
      '/tmp/README.md',
      '/tmp/package.json',
      '/tmp/src',
      '/tmp/src/index.js',
      '/tmp/test',
      '/tmp/test/helper.js',
      '/tmp/test/int',
      '/tmp/test/int/index.test.js',
      '/tmp/test/unit',
      '/tmp/test/unit/index.test.js',
    ].sort());
  });
});
