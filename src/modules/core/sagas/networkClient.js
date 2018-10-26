/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeLatest, getContext } from 'redux-saga/effects';
import { providers, Wallet } from 'ethers';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http';
import ColonyNetworkClient from '@colony/colony-js-client';

// TODO in #452 - reinstate this import.
// import NetworkLoader from '@colony/colony-js-contract-loader-network';

import {
  LOAD_COLONY_NETWORK,
  LOAD_COLONY_NETWORK_ERROR,
  LOAD_COLONY_NETWORK_SUCCESS,
} from '../actionTypes';
// import { WALLET_SET } from '../../users/actionTypes';

/**
 * Return an initialized ColonyNetworkClient instance.
 */
function* initColonyNetworkClient() {
  const provider = new providers.JsonRpcProvider();

  let loader;
  switch (process.env.NETWORK_CLIENT_LOADER) {
    case 'trufflepig':
      loader = new TrufflepigLoader();
      break;
    default:
      // TODO in #452 - reinstate the default loader and remove the error.
      // loader = new NetworkLoader('rinkeby');
      // break;
      throw new Error(
        // eslint-disable-next-line max-len
        'The `NETWORK_CLIENT_LOADER` environment variable must be set to `trufflepig` at this time',
      );
  }

  // TODO in #452 - use `EthersWrappedWallet` with the wallet context (rather
  // than an `ethers` wallet with a private key from Trufflepig.
  const { privateKey } = yield loader.getAccount(0);
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet: new Wallet(privateKey, provider),
  });

  const networkClient = new ColonyNetworkClient({ adapter, query: {} });

  yield call([networkClient, networkClient.init]);

  return networkClient;
}

/**
 * Initialise a network client and set the `networkClient` context
 */
function* loadColonyNetwork(): Saga<void> {
  let networkClient;

  try {
    const { setInstance } = yield getContext('networkClient');

    // Attempt to get a new network client instance
    networkClient = yield call(initColonyNetworkClient);

    // Set the networkClient context to the new network client
    yield call(setInstance, networkClient);
  } catch (error) {
    yield put({
      type: LOAD_COLONY_NETWORK_ERROR,
      payload: { error: error.message },
    });
    return;
  }

  yield put({
    type: LOAD_COLONY_NETWORK_SUCCESS,
    payload: { address: networkClient.contract.address },
  });
}

/**
 * When the wallet is set, the network client should be loaded with
 * the new wallet.
 */
// function* setWallet(): Saga<void> {
//   yield put({ type: LOAD_COLONY_NETWORK });
// }

function* networkClientSagas(): any {
  yield takeLatest(LOAD_COLONY_NETWORK, loadColonyNetwork);
  // yield takeLatest(WALLET_SET, setWallet);
}

export default networkClientSagas;
