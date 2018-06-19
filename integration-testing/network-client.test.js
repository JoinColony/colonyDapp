import { isAddress } from 'web3-utils';
/*
 * As with the case with the network client helpers import, this can be resolved
 * using a custom jest submodules resolver, but has been put off for now, due
 * to the time investment required.
 */
/* eslint-disable-next-line import/no-unresolved */
import { localhost } from '../src/lib/colony-wallet/lib/es/providers';

import {
  getTrufflepigLoader,
  getWallet,
  getEthersAdapter,
  getNetworkClient,
} from './utils/network-client-helpers';

const JSON_RPC = 'http://localhost:8545/';

describe('`ColonyNetworkClient` is able to', () => {
  test('Get a new instance going', async () => {
    /*
     * Setup the HTTP contract loader (retrieves contracts abis via TrufflePig)
     */
    const contractLoader = getTrufflepigLoader();
    expect(contractLoader).toHaveProperty('_endpoint');
    expect(contractLoader).toHaveProperty('_transform');
    /*
     * Setup the Json RPC provideer
     */
    const rpcProvider = localhost(JSON_RPC);
    expect(rpcProvider).toHaveProperty('url', JSON_RPC);
    /*
     * Get the first account's private key
     */
    const privateKey =
      global.ganacheAccounts.private_keys[
        Object.keys(global.ganacheAccounts.private_keys)[0]
      ];
    /*
     * Open a new wallet instance with the above private key
     */
    const clientWallet = await getWallet();
    expect(clientWallet).toHaveProperty('privateKey', `0x${privateKey}`);
    /*
     * Setup the adapter
     */
    const ethersAdapter = await getEthersAdapter();
    expect(ethersAdapter).toHaveProperty('loader');
    expect(ethersAdapter).toHaveProperty('provider');
    expect(ethersAdapter).toHaveProperty('wallet');
    /*
     * Setup the Network Client Instance
     */
    const networkClient = await getNetworkClient();
    expect(networkClient).toHaveProperty('getColony');
    expect(networkClient).toHaveProperty('getMetaColonyClient');
    expect(networkClient).toHaveProperty('getMetaColonyAddress');
    expect(networkClient).toHaveProperty('getColonyCount');
    expect(networkClient).toHaveProperty('getColonyClient');
    expect(networkClient).toHaveProperty('getColonyVersionResolver');
    expect(networkClient).toHaveProperty('createToken');
    expect(networkClient).toHaveProperty('getCurrentColonyVersion');
    expect(networkClient).toHaveProperty('getParentSkillId');
    expect(networkClient).toHaveProperty('getReputationUpdateLogEntry');
    expect(networkClient).toHaveProperty('getReputationUpdateLogLength');
    expect(networkClient).toHaveProperty('getSkill');
    expect(networkClient).toHaveProperty('getSkillCount');
    expect(networkClient).toHaveProperty('createColony');
    expect(networkClient).toHaveProperty('deposit');
    expect(networkClient).toHaveProperty('upgradeColony');
    expect(networkClient).toHaveProperty('withdraw');
    /*
     * The Meta Colony should be available
     */
    const metaColonyClient = await networkClient.getMetaColonyClient();
    expect(isAddress(metaColonyClient.contract.address)).toBeTruthy();
  });
});
