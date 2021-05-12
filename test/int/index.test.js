import { expect } from 'chai';
import { main } from '../../src';

describe('main', () => {
  it('should create new package', async () => {
    // TODO make this proper
    await main({ rootDir: `${process.cwd()}/build` });
    expect(true).to.be.true;
  }).timeout(20000);
});
