/* @flow */

import { call, takeEvery } from 'redux-saga/effects';
import { providers } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import NetworkLoader from '@colony/colony-js-contract-loader-network';
import ColonyNetworkClient from '@colony/colony-js-client';

import networkContext from '~context/network';
import walletContext from '~context/wallet';

import type { Saga } from 'redux-saga';
import { LOAD_NETWORK } from '../actionTypes';

function* loadNetwork({ payload = {} }: Object): Saga<*> {
  // if already loaded into context, don't reload
  if (networkContext.instance) return;

  const network = payload.network || 'rinkeby';

  const loader = new NetworkLoader({ network });
  const provider = yield call(providers.getDefaultProvider, network);
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet: walletContext.instance,
  });
  const networkClient = new ColonyNetworkClient({ adapter, query: {} });
  // calling with networkClient as context (this)
  yield call([networkClient, networkClient.init]);

  yield call(networkContext.setInstance, networkClient);
}

function* networkSagas(): any {
  yield takeEvery(LOAD_NETWORK, loadNetwork);
}

export default networkSagas;
