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

function* claimMotionRewards({
  meta,
  payload: {
    userAddress,
    colonyAddress,
    motionId,
    transactionHash,
    sideYay,
    sideNay,
  },
}: Action<ActionTypes.COLONY_MOTION_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const {
      claimMotionRewardsYay,
      claimMotionRewardsNay,
    } = yield createTransactionChannels(meta.id, [
      'claimMotionRewardsYay',
      'claimMotionRewardsNay',
    ]);

    const batchKey = 'claimMotionRewards';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    /*
     * We need to do the claim reward transaction, potentially for both sides,
     * Once for yay and once of nay (if the user staked both sides)
     */
    if (sideYay) {
      yield createGroupTransaction(claimMotionRewardsYay, {
        context: ClientType.VotingReputationClient,
        methodName: 'claimRewardWithProofs',
        identifier: colonyAddress,
        params: [motionId, userAddress, 1],
        ready: false,
      });
    }
    if (sideNay) {
      yield createGroupTransaction(claimMotionRewardsNay, {
        context: ClientType.VotingReputationClient,
        methodName: 'claimRewardWithProofs',
        identifier: colonyAddress,
        params: [motionId, userAddress, 0],
        ready: false,
      });
    }

    if (sideYay) {
      yield takeFrom(
        claimMotionRewardsYay.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }
    if (sideNay) {
      yield takeFrom(
        claimMotionRewardsNay.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    if (sideYay) {
      yield put(transactionReady(claimMotionRewardsYay.id));
      yield takeFrom(
        claimMotionRewardsYay.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    if (sideNay) {
      yield put(transactionReady(claimMotionRewardsNay.id));
      yield takeFrom(
        claimMotionRewardsNay.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Update motion page values
     */
    yield fork(
      updateMotionValues,
      colonyAddress,
      userAddress,
      motionId,
      transactionHash,
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_CLAIM_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_MOTION_CLAIM_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* claimMotionRewardsSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_CLAIM, claimMotionRewards);
}
