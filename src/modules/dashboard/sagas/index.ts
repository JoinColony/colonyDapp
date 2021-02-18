import { all, call } from 'redux-saga/effects';

import actionSagas from './actions';
import TEMP_actionsSagas from './actions/index';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import colonyDeploymentSaga from './colonyFinishDeployment';
import taskSagas from './task';
import tokenSagas from './token';

export default function* setupDashboardSagas() {
  yield all([
    call(actionSagas),
    call(TEMP_actionsSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(colonyDeploymentSaga),
    call(taskSagas),
    call(tokenSagas),
  ]);
}
