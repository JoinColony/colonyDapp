import { call, put } from 'redux-saga/effects';

import { AllActions, ActionTypes } from '~redux/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { putError } from '~utils/saga/effects';

function* networkFetch() {
  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const feeInverse = yield colonyManager.networkClient.getFeeInverse();
    // @TODO any way we could be more precise here?
    const fee = 1 / feeInverse.toNumber();
    const version = yield colonyManager.networkClient.getCurrentColonyVersion();

    yield put<AllActions>({
      type: ActionTypes.NETWORK_FETCH_SUCCESS,
      payload: {
        fee: fee.toString(),
        feeInverse: feeInverse.toString(),
        version: version.toString(),
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.NETWORK_FETCH_ERROR, error);
  }
  return null;
}

export default function* networkSagas() {
  yield call(networkFetch);
}
