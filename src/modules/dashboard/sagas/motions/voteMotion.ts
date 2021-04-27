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

function* voteMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote, transactionHash },
}: Action<ActionTypes.COLONY_MOTION_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const { domainId, rootHash } = yield votingReputationClient.getMotion(
      motionId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      userAddress,
      rootHash,
    );

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
      type: ActionTypes.COLONY_MOTION_VOTE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_MOTION_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* voteMotionSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_VOTE, voteMotion);
}
