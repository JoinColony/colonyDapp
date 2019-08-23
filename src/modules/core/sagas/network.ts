import { call, put } from 'redux-saga/effects';

import { AllActions, ActionTypes } from '~redux/index';

import { Context, getContext } from '~context/index';

import { putError } from '~utils/saga/effects';

function* networkFetch() {
  try {
    const colonyManager = yield getContext(Context.COLONY_MANAGER);

    const { feeInverse: feeInverseBigNum } = yield call([
      colonyManager.networkClient.getFeeInverse,
      colonyManager.networkClient.getFeeInverse.call,
    ]);

    const feeInverse = feeInverseBigNum.toNumber();

    const { version } = yield call([
      colonyManager.networkClient.getCurrentColonyVersion,
      colonyManager.networkClient.getCurrentColonyVersion.call,
    ]);

    yield put<AllActions>({
      type: ActionTypes.NETWORK_FETCH_SUCCESS,
      payload: {
        fee: 1 / feeInverse,
        feeInverse,
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
