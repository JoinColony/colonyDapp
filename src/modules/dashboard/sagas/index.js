/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import domainsSagas from './domains';
import draftsSagas from './drafts';
import tokenSagas from './token';
import taskSagas from './task';

export default function* dashboardSagas(): any {
  yield all([
    colonySagas(),
    domainsSagas(),
    draftsSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
