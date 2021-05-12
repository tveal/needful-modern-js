import * as Promise from 'bluebird';
import { merge } from 'lodash';
import { ProjectConnector } from './connector';
import { DEV_DEPENDENCIES, DEPENDENCIES, BABELRC_CONTENT, PKG_CONFIG } from './constants';

export const main = async (props) => {
  const { rootDir } = props;

  const project = new ProjectConnector({ rootDir });

  if (project.hasFile('package.json')) {
    await project.saveFile('notes.txt', 'Aye, existing project!');
  } else {
    await project.saveFile('notes.txt', 'Initializing a new project!');
    project.bash('npm init -y');
  }
  project.bash(`npm i -D ${DEV_DEPENDENCIES.join(' ')}`);
  project.bash(`npm i ${DEPENDENCIES.join(' ')}`);

  /*
    TODO
    - eslint
    - build cleanup
    - int test proper asserts
    - .gitignore merge with project
    - nyc config
    - test folder setup?
    - build script?
    - conditionals
      - webpack?
      - serverless-webpack/babel-loader?
  */
  
  const pkgConfig = project.loadPackageConfig();
  merge(pkgConfig, PKG_CONFIG);
  await Promise.all([
    project.savePackageConfig(pkgConfig),
    project.saveFile('.babelrc', BABELRC_CONTENT),
  ]);
};
