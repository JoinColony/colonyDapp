/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import adminsSagas from './admins';
import domainsSagas from './domains';
import tokenSagas from './token';
import taskSagas from './tasks';

export default function* dashboardSagas(): any {
  yield all([
    adminsSagas(),
    colonySagas(),
    domainsSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
