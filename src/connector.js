import {
  existsSync,
  writeFile,
  writeFileSync,
  readFile,
  readFileSync,
  mkdirSync,
} from 'fs';
import { execSync } from 'child_process';
import { promisify } from 'bluebird';
import { isArray } from 'lodash';
import { log } from './utils/logger';

export class ProjectConnector {
  constructor(rootDir) {
    // const { rootDir } = props;
    this.rootDir = rootDir;

    if (!this.hasFile(rootDir)) {
      mkdirSync(this.rootDir, { recursive: true });
    }

    if (!this.hasFile('package.json')) {
      log.info('initializing new npm project...');
      this.bash('npm init -y');
    }
    this.loadPackageConfig();
  }

  loadPackageConfig() {
    const config = JSON.parse(readFileSync(`${this.rootDir}/package.json`));
    this.config = config;
    return config;
  }

  savePackageConfig(config) {
    if (config) {
      this.config = config;
    }
    return writeFileSync(`${this.rootDir}/package.json`, JSON.stringify(this.config, null, 2));
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

  /* synchronously run a bash command or array of commands */
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
    return isArray(cmd)
      ? cmd.map(c => execSync(c, options))
      : execSync(cmd, options);
  }
}
