export const globalOptions = {
  package: {
    alias: 'p',
    type: 'string',
    describe: 'npm package name',
  },
  // log flags
  debug: {
    alias: 'd',
    type: 'boolean',
    describe: 'all logs',
  },
  info: {
    alias: 'i',
    type: 'boolean',
    describe: 'info + error logs',
  },
  quiet: {
    alias: 'q',
    type: 'boolean',
    describe: 'suppress logging',
  },
};
