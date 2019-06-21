/* @flow */

import type { Saga } from 'redux-saga';

import { all, call } from 'redux-saga/effects';

import rolesSagas from './roles';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import domainsSagas from './domains';
import taskSagas from './task';
import tokenSagas from './token';

export default function* setupDashboardSagas(): Saga<void> {
  yield all([
    call(rolesSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(domainsSagas),
    call(taskSagas),
    call(tokenSagas),
  ]);
}
