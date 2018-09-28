/* @flow */
import { all } from 'redux-saga/effects';

import colonySagas from './colony';

export default function* rootSaga(): any {
  yield all([colonySagas()]);
}
