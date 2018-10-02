/* @flow */

import { all } from 'redux-saga/effects';

import networkClientSagas from './networkClient';

export default function* rootSaga(): any {
  yield all([networkClientSagas()]);
}
