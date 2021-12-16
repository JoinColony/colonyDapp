import { call, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';

import { getTxChannel } from '../../../core/sagas';

function* claimAllocation({
  meta,
  payload,
}: Action<ActionTypes.META_CLAIM_ALLOCATION>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    yield put<AllActions>({
      type: ActionTypes.META_CLAIM_ALLOCATION_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.META_CLAIM_ALLOCATION_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimAllocationSaga() {
  yield takeEvery(ActionTypes.META_CLAIM_ALLOCATION, claimAllocation);
}
