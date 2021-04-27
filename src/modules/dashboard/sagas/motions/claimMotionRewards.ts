import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
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
  payload: { userAddress, colonyAddress, motionId, transactionHash },
}: Action<ActionTypes.COLONY_MOTION_CLAIM>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

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
     *
     * To do that we try to estimate both transactions, and the one that fails,
     * we know there are no rewards to be claimed on that side
     */
    let sideYay = false;
    let sideNay = false;
    try {
      /*
       * @NOTE For some reason colonyJS doesn't export types for the estimate methods
       */
      // @ts-ignore
      yield votingReputationClient.estimate.claimRewardWithProofs(
        motionId,
        userAddress,
        1,
      );
      sideYay = true;
    } catch (error) {
      /*
       * We don't want to handle the error here as we are doing this to
       * inferr the user's reward
       *
       * This is a "cheaper" alternative to looking through events, since
       * this doesn't use so many requests
       */
      // silent error
    }
    try {
      /*
       * @NOTE For some reason colonyJS doesn't export types for the estimate methods
       */
      // @ts-ignore
      yield votingReputationClient.estimate.claimRewardWithProofs(
        motionId,
        userAddress,
        0,
      );
      sideNay = true;
    } catch (error) {
      /*
       * We don't want to handle the error here as we are doing this to
       * inferr the user's reward
       *
       * This is a "cheaper" alternative to looking through events, since
       * this doesn't use so many requests
       */
      // silent error
    }
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
