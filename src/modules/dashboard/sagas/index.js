/* @flow */

import { all } from 'redux-saga/effects';

import adminsSagas from './admins';
import colonySagas from './colony';
import commentsSagas from './comments';
import taskSagas from './task';
import tokenSagas from './token';

export default function* dashboardSagas(): any {
  yield all([
    adminsSagas(),
    colonySagas(),
    commentsSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
