import { existsSync, writeFile, readFile } from 'fs';
import { execSync } from 'child_process';
import { promisify } from 'bluebird';

export class ProjectConnector {
  constructor(props) {
    const { rootDir } = props;
    this.rootDir = rootDir;
  }

  loadPackageConfig() {
    return require(`${this.rootDir}/package.json`);
  }

  savePackageConfig(config) {
    return promisify(writeFile)(`${this.rootDir}/package.json`, JSON.stringify(config, null, 2));
  }

  hasFile(relativePath) {
    return existsSync(`${this.rootDir}/${relativePath}`);
  }

  saveFile(relativePath = 'error.log', content = '') {
    return promisify(writeFile)(`${this.rootDir}/${relativePath}`, content);
  }

  loadFile(relativePath) {
    return promisify(readFile)(`${this.rootDir}/${relativePath}`);
  }
  
  bash(cmd, cwd) {
    const options = {
      encoding: 'utf8',
      shell: '/bin/bash',
      stdio: 'inherit',
      cwd: this.rootDir,
    };
    if (cwd) {
      options.cwd = cwd;
    }
    return execSync(cmd, options);
  }
};
