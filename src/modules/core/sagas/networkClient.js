/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery, getContext } from 'redux-saga/effects';
import { providers } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import NetworkLoader from '@colony/colony-js-contract-loader-network';
import ColonyNetworkClient from '@colony/colony-js-client';

import { LOAD_COLONY_NETWORK } from '../actionTypes';
import {
  loadColonyNetworkError,
  loadColonyNetworkSuccess,
} from '../actionCreators';
import EthersWrappedWallet from '../../../lib/EthersWrappedWallet';

function* initColonyNetworkClient() {
  const provider = new providers.JsonRpcProvider();
  const { instance: wallet } = yield getContext('currentWallet');

  let loader;
  switch (process.env.NETWORK_CLIENT_LOADER) {
    case 'trufflepig':
      loader = new TrufflepigLoader();
      break;
    default:
      loader = new NetworkLoader('rinkeby');
      break;
  }

  const adapter = new EthersAdapter({
    loader,
    provider,
    // $FlowFixMe colonyJS IWallet uses sync methods, but async works also
    wallet: new EthersWrappedWallet(wallet, provider),
  });

  const networkClient = new ColonyNetworkClient({ adapter, query: {} });

  yield call([networkClient, networkClient.init]);

  return networkClient;
}

function* loadColonyNetwork(): Saga<*> {
  try {
    const { instance, setInstance } = yield getContext('networkClient');
    let networkClient = instance;

    // If already loaded into context, don't reload
    if (networkClient) {
      yield put(loadColonyNetworkSuccess(networkClient));
      return;
    }

    // Initialise a new network client
    networkClient = yield call(initColonyNetworkClient);

    // Set the context to the newly-loaded network client
    yield call(setInstance, networkClient);

    yield put(loadColonyNetworkSuccess(networkClient));
  } catch (error) {
    yield put(loadColonyNetworkError(error));
  }
}

function* networkClientSagas(): any {
  yield takeEvery(LOAD_COLONY_NETWORK, loadColonyNetwork);
}

export default networkClientSagas;
