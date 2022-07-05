import { put, takeEvery, fork } from 'redux-saga/effects';

import { ActionTypes, AllActions, Action } from '~redux/index';
import { putError } from '~utils/saga/effects';
import { updateMotionValues } from '../utils';

function* motionStateUpdate({
  payload: { colonyAddress, motionId, userAddress },
  meta,
}: Action<ActionTypes.MOTION_STATE_UPDATE>) {
  try {
    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_STATE_UPDATE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_STATE_UPDATE_ERROR, error);
  }
  return null;
}

export default function* updateMotionStateSaga() {
  yield takeEvery(ActionTypes.MOTION_STATE_UPDATE, motionStateUpdate);
}
