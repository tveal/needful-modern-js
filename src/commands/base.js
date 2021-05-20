import {
  log, setLogLevel, runner, toUnitOfWork, commands,
} from '../utils';
import { globalOptions } from './shared';
import baseInstall from '../tasks/base';

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

    const tasks = {
      installer: async u => log.info('uow: %j', u),
      baseInstall,
    };

    try {
      await runner(tasks, uow, false);
    } catch (e) /* istanbul ignore next */ {
      log.error(e);
      process.exit(-1);
    }
  },
};
