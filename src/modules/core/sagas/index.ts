import { takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '~redux/index';

import setupUserContext from './setupUserContext';
// import ipfsSagas from './ipfs';

export default function* rootSaga() {
  /*
   * WALLET_CREATE
   * is the entry point for all other sagas that depend on the user having a wallet
   * -> ddb, colonyJS, etc and all subsequent actions
   */
  yield takeLatest(ActionTypes.WALLET_CREATE, setupUserContext);
  // Everything else that does not require a wallet
  // yield call(ipfsSagas);
}

export * from './transactions';
export * from './messages';
