import { expect } from 'chai';
import { TestFileSystem } from '../fixtures';
import { ProjectConnector } from '../../src/connector';

describe('ProjectConnector', () => {
  afterEach(() => {
    TestFileSystem.reset();
  });
  it('should create rootDir if not present', () => {
    const rootDir = '/tmp/test/cool-pkg';
    TestFileSystem.use();

    const project = new ProjectConnector(rootDir);

    expect(project.rootDir).to.equal(rootDir);
    expect(TestFileSystem.files).to.deep.equal({ '/tmp/test/cool-pkg': true });
  });
  it('should use existing rootDir', () => {
    const rootDir = '/tmp/test/cool-pkg';
    TestFileSystem.use()
      .addFile(rootDir, true);

    const project = new ProjectConnector(rootDir);

    expect(project.rootDir).to.equal(rootDir);
    expect(TestFileSystem.files).to.deep.equal({ '/tmp/test/cool-pkg': true });
  });
  it('should support bash with cwd param', () => {
    const rootDir = '/tmp/test/cool-pkg';
    TestFileSystem.use();

    const project = new ProjectConnector(rootDir);
    project.bash('echo "Hello World!"', '/world');

    expect(TestFileSystem.cmdHistory).to.deep.equal([
      {
        cmd: 'npm init -y',
        options: {
          encoding: 'utf8',
          shell: '/bin/bash',
          stdio: 'inherit',
          cwd: rootDir,
        },
      },
      {
        cmd: 'echo "Hello World!"',
        options: {
          encoding: 'utf8',
          shell: '/bin/bash',
          stdio: 'inherit',
          cwd: '/world',
        },
      },
    ]);
  });
});
