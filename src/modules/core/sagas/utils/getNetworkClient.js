/* @flow */

import type { Saga } from 'redux-saga';

import { call } from 'redux-saga/effects';
import { providers } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import ColonyNetworkClient from '@colony/colony-js-client';
import NetworkLoader from '@colony/colony-js-contract-loader-network';

import { create } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import EthersWrappedWallet from '../../../../lib/EthersWrappedWallet/index';

/*
 * Return an initialized ColonyNetworkClient instance.
 */
export default function* getNetworkClient(): Saga<ColonyNetworkClient> {
  const network = process.env.NETWORK || 'rinkeby';
  const provider =
    network === 'local'
      ? yield create(providers.JsonRpcProvider)
      : yield call(providers.getDefaultProvider, network);
  const wallet = yield* getContext(CONTEXT.WALLET);

  let loader;
  switch (process.env.LOADER) {
    case 'trufflepig':
      loader = yield create(TrufflepigLoader);
      break;
    default:
      loader = yield create(NetworkLoader, { network });
      break;
  }

  const adapter = yield create(EthersAdapter, {
    loader,
    provider,
    wallet: yield create(EthersWrappedWallet, wallet, provider),
  });

  const networkClient = yield create(ColonyNetworkClient, {
    adapter,
    query: {},
  });

  yield call([networkClient, networkClient.init]);

  return networkClient;
}
