/* @flow */

import { all } from 'redux-saga/effects';

import adminsSagas from './admins';
import colonySagas from './colony';
import domainsSagas from './domains';
import draftsSagas from './drafts';
import taskSagas from './task';
import tokenSagas from './token';

export default function* dashboardSagas(): any {
  yield all([
    adminsSagas(),
    colonySagas(),
    domainsSagas(),
    draftsSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
