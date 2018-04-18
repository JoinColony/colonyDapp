/* eslint-env jest */
import IPFS from '../ipfs'

describe('IPFS component', () => {
  test('Create the initial IPFS object', () => {
    const ipfs = IPFS.fromDefaultConfig();
    expect(ipfs).toBeTruthy();
  });
});
