/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import domainsSagas from './domains';
import tokenSagas from './token';
import taskSagas from './task';

export default function* dashboardSagas(): any {
  yield all([colonySagas(), taskSagas(), tokenSagas(), domainsSagas()]);
}
