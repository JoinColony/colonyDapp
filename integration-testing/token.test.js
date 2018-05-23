import { isAddress } from 'web3-utils';
import { getNetworkClient } from './utils/network-client-helpers';

describe('`ColonyNetworkClient` is able to', () => {
  test('Create and deploy a new Token', async () => {
    const networkClient = await getNetworkClient();
    /*
     * Create a new token
     */
    const token = await networkClient.createToken({
      name: 'Integration Test Token',
      symbol: 'ITT',
    });
    /*
     * Check if it's a valid address
     */
    expect(isAddress(token)).toBeTruthy();
  });
});
