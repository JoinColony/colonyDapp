import { call, put } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';

import { AllActions, ActionTypes } from '~redux/index';

import { Context, getContext } from '~context/index';

import { putError } from '~utils/saga/effects';

function* networkFetch() {
  try {
    const colonyManager = yield getContext(Context.COLONY_MANAGER);

    const { feeInverse } = yield call([
      colonyManager.networkClient.getFeeInverse,
      colonyManager.networkClient.getFeeInverse.call,
    ]);

    const fee = bigNumberify(1).div(feeInverse).toString();

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
