/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';
import { providers, Wallet } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import ColonyNetworkClient from '@colony/colony-js-client';

// TODO in #452 - reinstate this import.
// import NetworkLoader from '@colony/colony-js-contract-loader-network';

import { create } from '~utils/saga/effects';

/**
 * Return an initialized ColonyNetworkClient instance.
 */
// eslint-disable-next-line import/prefer-default-export
export function* getNetworkClient(): Saga<ColonyNetworkClient> {
  const provider = yield create(providers.JsonRpcProvider);

  let loader;
  switch (process.env.NETWORK_CLIENT_LOADER) {
    case 'trufflepig':
      loader = yield create(TrufflepigLoader);
      break;
    default:
      // TODO in #452 - reinstate the default loader and remove the error.
      // TODO: use `yield create`
      // loader = new NetworkLoader('rinkeby');
      // break;
      throw new Error(
        // eslint-disable-next-line max-len
        'The `NETWORK_CLIENT_LOADER` environment variable must be set to `trufflepig` at this time',
      );
  }

  // TODO in #452 - use `EthersWrappedWallet` with the wallet context (rather
  // than an `ethers` wallet with a private key from Trufflepig.
  // You can use `const wallet = yield getContext('wallet')`
  const { privateKey } = yield loader.getAccount(0);
  const adapter = yield create(EthersAdapter, {
    loader,
    provider,
    wallet: new Wallet(privateKey, provider),
  });

  const networkClient = yield create(ColonyNetworkClient, {
    adapter,
    query: {},
  });

  yield call([networkClient, networkClient.init]);

  return networkClient;
}
