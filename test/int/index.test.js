import { expect } from 'chai';
import baseInstall from '../../src/executors/base';

describe('baseInstall', () => {
  it('should create new package', async () => {
    // TODO make this proper
    await baseInstall({ rootDir: `${process.cwd()}/build` });
    expect(true).to.be.true;
  }).timeout(40000);
});
