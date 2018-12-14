/* @flow */

import { all } from 'redux-saga/effects';

import colonySagas from './colony';
import domainSagas from './domain';
import tokenSagas from './token';
import taskSagas from './task';

export default function* dashboardSagas(): any {
  yield all([colonySagas(), domainSagas(), taskSagas(), tokenSagas()]);
}
