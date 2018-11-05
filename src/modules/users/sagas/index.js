/* @flow */

import { all } from 'redux-saga/effects';

import walletSagas from './walletSagas';
import userSagas from './userSagas';

export default function* rootSaga(): any {
  yield all([walletSagas(), userSagas()]);
}

export * from './walletSagas';
export * from './userSagas';
