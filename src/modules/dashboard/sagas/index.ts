import { all, call } from 'redux-saga/effects';

import actionSagas from './actions';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import taskSagas from './task';
import tokenSagas from './token';

export default function* setupDashboardSagas() {
  yield all([
    call(actionSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(taskSagas),
    call(tokenSagas),
  ]);
}
