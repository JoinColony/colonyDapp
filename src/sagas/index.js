/* @flow */

import { all } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import colony from './colony';

export default function* rootSaga(): Saga<*> {
  yield all(colony());
}
