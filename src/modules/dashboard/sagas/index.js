/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import adminsSagas from './admins';
import domainsSagas from './domains';
import draftsSagas from './drafts';
import tokenSagas from './token';
import taskSagas from './task';

export default function* dashboardSagas(): any {
  yield all([
    colonySagas(),
    adminsSagas(),
    domainsSagas(),
    draftsSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
