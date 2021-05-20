import _ from 'highland';
import { v4 } from 'uuid';
import DEBUG from 'debug';
import Promise from 'bluebird';

const ERROR_LEVEL = 'error*';
DEBUG.enable(ERROR_LEVEL);

// abstracted for unit tests
export const uuid = {
  generate: () => v4(),
};

export const createLogger = app => {
  const log = {
    info: '',
    error: '',
    debug: '',
  };
  Object.keys(log).forEach(level => {
    let loggerPrefix = level;
    if (app) {
      loggerPrefix = `${level}:${app}`;
    }
    // eslint-disable-next-line global-require
    log[level] = DEBUG(loggerPrefix);
    // log[level].log = console.log.bind(console); // send to stdout instead of stderr
  });
  return log;
};

export const log = createLogger();
export const setLogLevel = argv => {
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

export const runner = (tasks = {}, uow, parallel = true) => _(Object.keys(tasks))
  .map(task => ({
    taskName: task,
    task: tasks[task],
    unitId: uuid.generate(),
    ...uow,
  }))
  .tap(debug('START %j'))
  .map(runTheTask)
  .parallel(parallel ? 10 : 1)
  .tap(debug('END %j'))
  .collect()
  .toPromise(Promise);

const debug = msg => data => log.debug(msg, data);
const runTheTask = uow => {
  const { taskName, task } = uow;
  const theTask = async () => {
    log.info(`start: ${taskName}`);
    const result = await task(uow);
    log.info(`end: ${taskName}`);
    return { ...uow, result };
  };
  return _(theTask());
};
