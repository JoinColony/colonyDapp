/* @flow */

import { all, setContext } from 'redux-saga/effects';

import walletSagas from './walletSagas';
import userSagas from './userSagas';

export default function* rootSaga(): any {
  yield setContext({ foo: 'bar' });
  yield all([userSagas(), walletSagas()]);
}
