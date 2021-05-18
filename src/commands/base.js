// import { log, setLogLevel, initialize } from '../utils';
import {
  log, setLogLevel, runner, toUnitOfWork, commands,
} from '../utils';
import { globalOptions } from './shared';
import baseInstall from '../executors/base';

export default {
  command: [commands.BASE, '$0'],
  describe: 'setup base config with babel, mocha, chai',
  builder: {
    latest: {
      alias: 'l',
      type: 'boolean',
      describe: 'pull latest, potentially untested dependencies',
    },
    ...globalOptions,
  },
  handler: async argv => {
    setLogLevel(argv);
    const uow = toUnitOfWork(argv);

    try {
      await runner({
        installer: u => log.info('argv: %j', u),
        baseInstall,
      }, uow);
    } catch (e) {
      log.error(e);
      process.exit(-1);
    }
  },
};
