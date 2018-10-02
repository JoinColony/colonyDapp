/* @flow */

import { call, put, takeEvery, getContext } from 'redux-saga/effects';
import { providers } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import NetworkLoader from '@colony/colony-js-contract-loader-network';
import ColonyNetworkClient from '@colony/colony-js-client';

import type { Saga } from 'redux-saga';
import { LOAD_COLONY_NETWORK, COLONY_NETWORK_LOADED } from '../actionTypes';
import { EthersWrappedWallet } from '~utils/wallet';

function* loadNetworkClient({ payload = {} }: Object): Saga<*> {
  let { instance: networkClient } = yield getContext('networkClient');

  // If already loaded into context, don't reload
  if (networkClient) {
    yield put({ type: COLONY_NETWORK_LOADED, networkClient });
    return;
  }

  const network = payload.network || 'rinkeby';
  const loader = new NetworkLoader({ network });
  const provider = yield call(providers.getDefaultProvider, network);
  const { instance: wallet } = yield getContext('currentWallet');
  const adapter = new EthersAdapter({
    loader,
    provider,
    // $FlowFixMe wrapped wallet doesn't quite conform
    wallet: new EthersWrappedWallet(wallet, provider),
  });
  // $FlowFixMe why does it still want query?!
  networkClient = new ColonyNetworkClient({ adapter });

  // calling with networkClient as context (`this`)
  yield call([networkClient, networkClient.init]);

  const { setInstance } = yield getContext('networkClient');
  yield call(setInstance, networkClient);

  yield put({ type: COLONY_NETWORK_LOADED, networkClient });
}

function* networkClientSagas(): any {
  yield takeEvery(LOAD_COLONY_NETWORK, loadNetworkClient);
}

export default networkClientSagas;
