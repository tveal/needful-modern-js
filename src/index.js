#!/usr/bin/env node
/* istanbul ignore file */
import yargs from 'yargs';
import base from './commands/base';

yargs
  .command(base)
  // .command(serverless)
  .demandCommand()
  .alias('h', 'help')
  .help()
  .argv;

/*
  TODO
  - build cleanup
  - int test proper asserts
  - .gitignore merge with project
  - build script?
  - conditionals
    - webpack?
    - serverless-webpack/babel-loader?
*/
