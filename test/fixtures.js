import sinon from 'sinon';
import fs from 'fs';
import { isFunction } from 'lodash';
import childProcess from 'child_process';

// https://github.com/tveal/software-engineer-handbook/blob/main/book/3be79bb7-d905-4e88-9f35-3b6505c638ab.md#comparing-objects-containing-functions
export const subFunctions = obj => JSON.parse(
  JSON.stringify(obj, (k, v) => (isFunction(v) ? 'Function' : v)),
);

export const TestFileSystem = {
  files: {},
  cmdHistory: [],
  use() {
    sinon.stub(fs, 'appendFile').callsFake((path, content, cb) => {
      if (this.files[path]) {
        this.files[path] = `${this.files[path]}${content}`;
      } else {
        this.files[path] = content;
      }
      cb();
    });
    sinon.stub(fs, 'existsSync').callsFake(path => !!this.files[path]);
    sinon.stub(fs, 'mkdirSync').callsFake(path => {
      this.files[path] = true; // test directory
      return path;
    });
    sinon.stub(fs, 'readFile').callsFake((path, cb) => cb(undefined, this.files[path]));
    sinon.stub(fs, 'readFileSync').callsFake(path => {
      if (this.files[path]) return this.files[path];
      if (path.includes('package.json')) {
        return JSON.stringify({
          name: 'blah',
          version: '1.0.0',
          description: '',
          main: 'index.js',
          scripts: {
            test: 'echo "Error: no test specified" && exit 1',
          },
          keywords: [],
          author: '',
          license: 'ISC',
        });
      }
      return undefined;
    });
    sinon.stub(fs, 'writeFile').callsFake((path, content, cb) => {
      this.addFile(path, content);
      cb();
    });
    sinon.stub(fs, 'writeFileSync').callsFake((path, content) => {
      this.addFile(path, content);
    });
    sinon.stub(childProcess, 'execSync').callsFake((cmd, options) => {
      this.cmdHistory.push({ cmd, options });
    });
    return this;
  },
  reset() {
    this.files = {};
    this.cmdHistory = [];
    sinon.restore();
  },

  addFile(path, content) {
    this.files[path] = content;
    return this;
  },
  removeFile(path) {
    delete this.files[path];
    return this;
  },
};
