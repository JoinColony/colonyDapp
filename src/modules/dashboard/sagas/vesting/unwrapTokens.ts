import { call, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';

import { getTxChannel } from '../../../core/sagas';

function* unwrapToken({
  meta,
  payload,
}: Action<ActionTypes.META_UNWRAP_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    yield put<AllActions>({
      type: ActionTypes.META_UNWRAP_TOKEN_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.META_UNWRAP_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* unwrapTokenSaga() {
  yield takeEvery(ActionTypes.META_UNWRAP_TOKEN, unwrapToken);
}
