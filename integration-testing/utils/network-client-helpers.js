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
/* eslint-disable import/no-unresolved */
import { TrufflepigLoader } from '../../src/lib/colony-js/packages/colony-js-contract-loader-http';
import { localhost } from '../../src/lib/colony-wallet/lib/es/providers';
import { software as wallet } from '../../src/lib/colony-wallet/lib/es/wallets';
import EthersAdapter from '../../src/lib/colony-js/packages/colony-js-adapter-ethers';
import NetworkClient from '../../src/lib/colony-js/packages/colony-js-client';

const JSON_RPC = 'http://localhost:8545/';
const TRUFFLEPIG_URL = 'http://localhost:3030';

const privateKey =
  global.ganacheAccounts.private_keys[
    Object.keys(global.ganacheAccounts.private_keys)[0]
  ];

export const getTrufflepigLoader = () =>
  new TrufflepigLoader({
    endpoint: `${TRUFFLEPIG_URL}/contracts?name=%%NAME%%`,
  });

export const getWallet = () =>
  wallet.open({
    privateKey: `0x${privateKey}`,
    provider: localhost(JSON_RPC),
  });

export const getEthersAdapter = async () =>
  new EthersAdapter({
    loader: getTrufflepigLoader(),
    provider: localhost(JSON_RPC),
    wallet: await getWallet(),
  });

export const getNetworkClient = async () => {
  const networkClient = new NetworkClient({
    adapter: await getEthersAdapter(),
  });
  await networkClient.init();
  return networkClient;
};
