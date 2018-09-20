/* @flow */

import { providers, Wallet } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import NetworkLoader from '@colony/colony-js-contract-loader-network';
import ColonyNetworkClient from '@colony/colony-js-client';

const network = 'rinkeby';

const loader = new NetworkLoader({ network });
const provider = providers.getDefaultProvider(network);
// TODO: use Purser
const wallet = Wallet.createRandom();
const adapter = new EthersAdapter({
  loader,
  provider,
  wallet,
});

let instance;
const loadNetwork = async () => {
  const networkClient = new ColonyNetworkClient({ adapter });
  await networkClient.init();
  instance = networkClient;
  return instance;
};

const getInstance = async () => instance || loadNetwork();

export default getInstance;
