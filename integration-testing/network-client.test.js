/*
 * Importing the `colony-js` packages directly since I couldn't make `jest` play nicely
 * with importing them from submodules.
 *
 * @TODO Write custom `jest` submodules resolver
 *
 * I think this can be resolved by using a custom `jest` resolver that will tell
 * it where to search.
 * I've put if off for now since it involves a bit of a time investment to
 * get it right.
 */
import { TrufflepigLoader } from '../src/lib/colony-js/packages/colony-js-contract-loader-http';
import EthersAdapter from '../src/lib/colony-js/packages/colony-js-adapter-ethers';
import NetworkClient from '../src/lib/colony-js/packages/colony-js-client';
import { software as wallet } from '../src/lib/colony-wallet/lib/es/wallets';
import { localhost } from '../src/lib/colony-wallet/lib/es/providers';

const JSON_RPC = 'http://localhost:8545/';
const TRUFFLEPIG_URL = 'http://localhost:3030';

describe('`ColonyNetworkClient` is able to', () => {
  test('Get a new instance going', async () => {
    /*
     * Setup the HTTP contract loader (retrieves contracts abis via TrufflePig)
     */
    const contractLoader = new TrufflepigLoader({
      endpoint: `${TRUFFLEPIG_URL}/contracts?name=%%NAME%%`,
    });
    // console.log(contractLoader);
    expect(contractLoader).toHaveProperty('_endpoint');
    expect(contractLoader).toHaveProperty('_parse');
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
    const clientWallet = await wallet.open({
      privateKey: `0x${privateKey}`,
      provider: rpcProvider,
    });
    expect(clientWallet).toHaveProperty('privateKey', `0x${privateKey}`);
    /*
     * Setup the adapter
     */
    const ethersAdapter = new EthersAdapter({
      loader: contractLoader,
      provider: rpcProvider,
      wallet: clientWallet,
    });
    expect(ethersAdapter).toHaveProperty('loader');
    expect(ethersAdapter).toHaveProperty('provider');
    expect(ethersAdapter).toHaveProperty('wallet');
    /*
     * Setup the Network Client Instance
     */
    const networkClient = await NetworkClient.createSelf(ethersAdapter);
    expect(networkClient).toHaveProperty('getColonyById');
    expect(networkClient).toHaveProperty('getColonyByKey');
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
  });
});
