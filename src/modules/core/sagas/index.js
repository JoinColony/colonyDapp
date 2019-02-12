/* @flow */

import { all, takeLatest } from 'redux-saga/effects';

import { ACTIONS } from '~redux';

import { setupWalletSagas } from '../../users/sagas';
import setupUserContext from './setupUserContext';

export default function* rootSaga(): any {
  /*
   * WALLET_CREATE
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ACTIONS.WALLET_CREATE, setupUserContext);
  // Everything else that does not require a wallet
  yield all([setupWalletSagas()]);
}

export * from './transactions';
