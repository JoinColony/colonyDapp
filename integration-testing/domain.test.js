// import { bigNumberify } from 'ethers/utils';
// import { isAddress } from 'web3-utils';
import { getNetworkClient } from './utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';

describe('`ColonyClient` is able to', () => {
  test('Create a new Domain in the Colony', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Get the existing colony
     */
    const colonyClient = await networkClient.getColonyClient({
      key: colonyName,
    });
    console.log(colonyClient);
  });
});
