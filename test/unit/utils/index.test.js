import { expect } from 'chai';
import sinon from 'sinon';
import DEBUG from 'debug';
import { validate } from 'uuid';
import { subFunctions } from '../../fixtures';
import {
  uuid,
  runner,
  setLogLevel,
  createLogger,
  getProcessDir,
  toUnitOfWork,
} from '../../../src/utils';

describe('src/utils', () => {
  describe('createLogger', () => {
    it('should create logger with app prefix', () => {
      const log = createLogger('test');

      expect(typeof log.info === 'function').to.be.true;
      expect(typeof log.error === 'function').to.be.true;
      expect(typeof log.debug === 'function').to.be.true;

      expect(log.info.namespace).to.equal('info:test');
      expect(log.error.namespace).to.equal('error:test');
      expect(log.debug.namespace).to.equal('debug:test');
    });

    it('should create logger without app prefix', () => {
      const log = createLogger();

      expect(typeof log.info === 'function').to.be.true;
      expect(typeof log.error === 'function').to.be.true;
      expect(typeof log.debug === 'function').to.be.true;

      expect(log.info.namespace).to.equal('info');
      expect(log.error.namespace).to.equal('error');
      expect(log.debug.namespace).to.equal('debug');
    });
  });

  describe('setLogLevel', () => {
    let debugStub;
    beforeEach(() => {
      debugStub = sinon.stub(DEBUG, 'enable');
    });
    afterEach(sinon.restore);
    it('should set default level', () => {
      setLogLevel({});

      expect(debugStub).to.have.been.calledOnceWith('error*');
    });
    it('should set debug level', () => {
      setLogLevel({ debug: true });

      expect(debugStub).to.have.been.calledOnceWith('*');
    });
    it('should set info level', () => {
      setLogLevel({ info: true });

      expect(debugStub).to.have.been.calledOnceWith('info*,error*');
    });
    it('should set quiet level', () => {
      setLogLevel({ quiet: true });

      expect(debugStub).to.have.been.calledOnceWith('');
    });
  });

  describe('runner', () => {
    beforeEach(() => {
      let uuidCall = 0;
      sinon.stub(uuid, 'generate').callsFake(() => {
        uuidCall += 1;
        return `fake-uuid-${uuidCall}`;
      });
    });
    afterEach(sinon.restore);
    it('should not barf for no params', async () => {
      const runResult = await runner();

      expect(subFunctions(runResult)).to.deep.equal([]);
    });
    it('should return task outputs in order', async () => {
      const tasks = {
        setupCore: u => ({ core: 'v1.0' }),
        setupCli: u => ({ cli: 'bash' }),
      };
      const uow = { message: 'Hello World!' };

      const runResult = await runner(tasks, uow, false);

      expect(subFunctions(runResult)).to.deep.equal([
        {
          taskName: 'setupCore',
          task: 'Function',
          unitId: 'fake-uuid-1',
          message: 'Hello World!',
          result: {
            core: 'v1.0',
          },
        },
        {
          taskName: 'setupCli',
          task: 'Function',
          unitId: 'fake-uuid-2',
          message: 'Hello World!',
          result: {
            cli: 'bash',
          },
        },
      ]);
    });
  });
  describe('uuid', () => {
    it('should generate valid uuidv4', () => {
      expect(validate(uuid.generate())).to.be.true;
    });
  });
  describe('getProcessDir', () => {
    it('should get process directory', () => {
      expect(getProcessDir()).to.equal(process.cwd());
    });
  });
  describe('toUnitOfWork', () => {
    it('should get directory from package', () => {
      const argv = {
        package: 'blueberry',
      };
      expect(toUnitOfWork(argv)).to.deep.equal({
        argv,
        rootDir: `${process.cwd()}/blueberry`,
      });
    });
    it('should get directory from line arg', () => {
      const argv = {
        _: ['cherry'],
      };
      expect(toUnitOfWork(argv)).to.deep.equal({
        argv,
        rootDir: `${process.cwd()}/cherry`,
      });
    });
    it('should get current directory', () => {
      const argv = {};
      expect(toUnitOfWork(argv)).to.deep.equal({
        argv,
        rootDir: process.cwd(),
      });
    });
  });
});
