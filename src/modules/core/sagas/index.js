/* @flow */

import { all } from 'redux-saga/effects';

import networkClientSagas from './networkClient';

export default function* coreSagas(): any {
  yield all([networkClientSagas()]);
}
