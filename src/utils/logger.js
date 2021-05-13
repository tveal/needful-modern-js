import { v4 as uuidv4 } from 'uuid';
import DEBUG from 'debug';
import Promise from 'bluebird';

const ERROR_LEVEL = 'error*';
DEBUG.enable(ERROR_LEVEL);

export const createLogger = (unitId, app) => {
  const log = {
    info: () => { },
    error: () => { },
    debug: () => { },
  };
  Object.keys(log).forEach((level) => {
    let loggerPrefix = level;
    if (app) {
      loggerPrefix = `${level}:${app}`;
    }
    // eslint-disable-next-line global-require
    log[level] = DEBUG(loggerPrefix);
    // log[level].log = console.log.bind(console); // send to stdout instead of stderr
  });
  const id = unitId ? unitId : uuidv4();
  return {
    ...log,
    start: () => log.info('start: %s', id),
    end: () => log.info('end: %s', id),
  };
};

export const log = createLogger();
export const setLogLevel = (argv) => {
  const { info, quiet, debug } = argv;
  let level = ERROR_LEVEL;
  if (debug) {
    level = '*';
  } else if (info) {
    level = 'info*,error*';
  } else if (quiet) {
    level = '';
  }
  DEBUG.enable(level);
};
export const runner = (things = {}, uow) => {
  return Promise.all(Object.keys(things).map(async (executor) => {
    const logger = createLogger(executor);
    logger.start();
    const result = await things[executor]({ ...uow, executor });
    logger.end();
    return {
      executor,
      result,
    };
  }));
};
