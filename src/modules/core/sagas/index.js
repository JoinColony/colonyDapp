/* @flow */

import type { Saga } from 'redux-saga';

import { all, call, takeLatest } from 'redux-saga/effects';

import { ACTIONS } from '~redux';

import { setupWalletSagas } from '../../users/sagas';
import setupUserContext from './setupUserContext';
import ipfsSagas from './ipfs';
import connectionSagas from './connection';

export default function* rootSaga(): Saga<void> {
  /*
   * WALLET_CREATE
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ACTIONS.WALLET_CREATE, setupUserContext);
  // Everything else that does not require a wallet
  yield all([call(setupWalletSagas), call(ipfsSagas), call(connectionSagas)]);
}

export * from './transactions';
