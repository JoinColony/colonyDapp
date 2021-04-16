import { all, call } from 'redux-saga/effects';

import actionsSagas from './actions';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import colonyDeploymentSaga from './colonyFinishDeployment';
import colonyExtensionSagas from './extensions';
import tokenSagas from './token';
import stakeMotionSaga from './stakeMotion';

export default function* setupDashboardSagas() {
  yield all([
    call(actionsSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(colonyDeploymentSaga),
    call(colonyExtensionSagas),
    call(tokenSagas),
    call(stakeMotionSaga),
  ]);
}
