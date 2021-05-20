import { expect } from 'chai';
import { TestFileSystem } from '../../fixtures';
import BaseCommand from '../../../src/commands/base';

describe('src/commands/base', () => {
  describe('handler', () => {
    beforeEach(() => { TestFileSystem.use(); });
    afterEach(() => { TestFileSystem.reset(); });
    it('should setup project', async () => {
      const argv = { package: 'grape' };

      await BaseCommand.handler(argv);

      expect(Object.keys(TestFileSystem.files).sort()).to.deep.equal([
        `${process.cwd()}/grape`,
        `${process.cwd()}/grape/.babelrc`,
        `${process.cwd()}/grape/.eslintrc`,
        `${process.cwd()}/grape/.nycrc.json`,
        `${process.cwd()}/grape/README.md`,
        `${process.cwd()}/grape/package.json`,
        `${process.cwd()}/grape/src`,
        `${process.cwd()}/grape/src/index.js`,
        `${process.cwd()}/grape/test`,
        `${process.cwd()}/grape/test/helper.js`,
        `${process.cwd()}/grape/test/int`,
        `${process.cwd()}/grape/test/int/index.test.js`,
        `${process.cwd()}/grape/test/unit`,
        `${process.cwd()}/grape/test/unit/index.test.js`,
      ].sort());
    });
  });
});
