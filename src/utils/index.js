
export * from './logger';

export const commands = {
  BASE: 'base',
  SERVERLESS: 'sls',
};

// abstracted for mocking in tests :)
export const getProcessDir = () => process.cwd();

export const toUnitOfWork = (argv) => ({
  argv,
  rootDir: getRootDir(argv),
});

const getRootDir = (argv) => {
  if (argv.package) return `${getProcessDir()}/${argv.package}`;

  if (
    argv._[0] && !Object.values(commands).includes(argv._[0])
  ) {
    return `${getProcessDir()}/${argv._[0]}`;
  }
  
  return getProcessDir();
};