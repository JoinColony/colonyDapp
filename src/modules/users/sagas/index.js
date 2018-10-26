/* @flow */

import { all } from 'redux-saga/effects';

import walletSagas from './walletSagas';

export default function* rootSaga(): any {
  yield all([walletSagas()]);
}

export * from './walletSagas';
export * from './userSagas';
