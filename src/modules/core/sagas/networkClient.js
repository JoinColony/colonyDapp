/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery, getContext } from 'redux-saga/effects';
import { providers, Wallet } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import ColonyNetworkClient from '@colony/colony-js-client';

import { LOAD_COLONY_NETWORK } from '../actionTypes';
import {
  loadColonyNetworkError,
  loadColonyNetworkSuccess,
} from '../actionCreators';

// XXX Just for local testing; either make this configurable or replace it.
function* initLocalColonyNetworkClient() {
  const loader = new TrufflepigLoader();
  const provider = new providers.JsonRpcProvider();

  const privateKey = yield loader.getAccount(0);
  const privateWallet = new Wallet(privateKey, provider);

  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet: privateWallet,
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
    // XXX Currently using a local client for testing.
    networkClient = yield call(initLocalColonyNetworkClient);

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
