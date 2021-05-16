import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';
import { updateMotionValues } from '../utils/updateMotionValues';

function* finalizeMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId },
}: Action<ActionTypes.COLONY_MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const {
      finalizeMotionTransaction,
    } = yield createTransactionChannels(meta.id, ['finalizeMotionTransaction']);

    const batchKey = 'finalizeMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(finalizeMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'finalizeMotion',
      identifier: colonyAddress,
      params: [motionId],
      ready: false,
    });

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(finalizeMotionTransaction.id));

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_FINALIZE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_MOTION_FINALIZE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* finalizeMotionSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_FINALIZE, finalizeMotion);
}
