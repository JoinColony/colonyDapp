/* @flow */

import { all } from 'redux-saga/effects';

import networkSagas from './network';

export default function* rootSaga(): any {
  yield all([networkSagas()]);
}
