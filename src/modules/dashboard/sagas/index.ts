import { all } from 'redux-saga/effects';

// import actionsSagas from './actions';
// import colonySagas from './colony';
// import colonyCreateSaga from './colonyCreate';
// import colonyDeploymentSaga from './colonyFinishDeployment';
// import colonyExtensionSagas from './extensions';
// import motionSagas from './motions';
// import coinMachineSagas from './coinMachine';
// import whitelistSagas from './whitelist';

export default function* setupDashboardSagas() {
  yield all([
    // call(actionsSagas),
    // call(colonySagas),
    // call(colonyCreateSaga),
    // call(colonyDeploymentSaga),
    // call(colonyExtensionSagas),
    // call(motionSagas),
    // call(coinMachineSagas),
    // call(whitelistSagas),
  ]);
}
