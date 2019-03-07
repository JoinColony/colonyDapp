/* @flow */

import type { Saga } from 'redux-saga';

import { all, call } from 'redux-saga/effects';

import adminsSagas from './admins';
import colonySagas from './colony';
import domainsSagas from './domains';
import taskSagas from './task';
import tokenSagas from './token';

export default function* setupDashboardSagas(): Saga<void> {
  yield all([
    call(adminsSagas),
    call(colonySagas),
    call(domainsSagas),
    call(taskSagas),
    call(tokenSagas),
  ]);
}
