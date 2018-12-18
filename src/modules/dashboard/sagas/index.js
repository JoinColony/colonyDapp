/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import domainSagas from './domain';
import tokenSagas from './token';
import taskSagas from './task';
import draftSagas from './draft';

export default function* dashboardSagas(): any {
  yield all([
    colonySagas(),
    domainSagas(),
    draftSagas(),
    taskSagas(),
    tokenSagas(),
  ]);
}
