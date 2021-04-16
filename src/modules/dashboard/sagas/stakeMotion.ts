import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../core/sagas';
import { transactionReady } from '../../core/actionCreators';

function* stakeMotion({
  meta,
  payload: {
    userAddress,
    colonyAddress,
    motionId,
    motionDomainId,
    rootHash,
    vote,
    amount,
  },
}: Action<ActionTypes.MOTION_STAKE>) {
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

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      userAddress,
      rootHash,
    );

    const { approveStake, stake } = yield createTransactionChannels(meta.id, [
      'approveStake',
      'stake',
    ]);

    const batchKey = 'stake';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(approveStake, {
      context: ClientType.ColonyClient,
      methodName: 'approveStake',
      identifier: colonyAddress,
      params: [votingReputationClient.address, motionDomainId, amount],
      ready: false,
    });

    yield createGroupTransaction(stake, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotionWithProofs',
      identifier: colonyAddress,
      params: [motionId, vote, amount, key, value, branchMask, siblings],
      ready: false,
    });

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(approveStake.id));

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield takeFrom(stake.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(stake.id));

    yield takeFrom(stake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.MOTION_STAKE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_STAKE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* stakeMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_STAKE, stakeMotion);
}
