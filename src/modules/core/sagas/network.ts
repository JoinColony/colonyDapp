import { call, put } from 'redux-saga/effects';
import BigNumber from 'bn.js';

import { AllActions, ActionTypes } from '~redux/index';

import { Context, getContext } from '~context/index';

import { putError } from '~utils/saga/effects';

function* networkFetch() {
  try {
    const colonyManager = yield getContext(Context.COLONY_MANAGER);

    const { feeInverse: feeInverseContract } = yield call([
      colonyManager.networkClient.getFeeInverse,
      colonyManager.networkClient.getFeeInverse.call,
    ]);

    /*
     * @NOTE We need to re-convert this to a BigNumber as the version that's coming
     * from the networkClient is stripped-down and will fail our version of BN's validations
     */
    const feeInverse = new BigNumber(feeInverseContract.toString());
    const fee = new BigNumber(1).div(feeInverse).toString();

    const { version } = yield call([
      colonyManager.networkClient.getCurrentColonyVersion,
      colonyManager.networkClient.getCurrentColonyVersion.call,
    ]);

    yield put<AllActions>({
      type: ActionTypes.NETWORK_FETCH_SUCCESS,
      payload: {
        fee,
        feeInverse: feeInverse.toString(),
        version,
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
