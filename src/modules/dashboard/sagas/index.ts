import { all, call } from 'redux-saga/effects';

import actionsSagas from './actions';
import mteaActionsSagas from './actions/meta';
import colonySagas from './colony';
import colonyCreateSaga from './colonyCreate';
import colonyDeploymentSaga from './colonyFinishDeployment';
import colonyExtensionSagas from './extensions';
import motionSagas from './motions';
import coinMachineSagas from './coinMachine';
import whitelistSagas from './whitelist';
import vestingSagas from './vesting';

export default function* setupDashboardSagas() {
  yield all([
    call(actionsSagas),
    call(mteaActionsSagas),
    call(colonySagas),
    call(colonyCreateSaga),
    call(colonyDeploymentSaga),
    call(colonyExtensionSagas),
    call(motionSagas),
    call(coinMachineSagas),
    call(whitelistSagas),
    call(vestingSagas),
  ]);
}
