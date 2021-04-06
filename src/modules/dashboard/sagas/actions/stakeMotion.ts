import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

function* stakeMotionAction({
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
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
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

    const { stakeMotion } = yield createTransactionChannels(meta.id, [
      'stakeMotion',
    ]);

    yield fork(createTransaction, stakeMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotion',
      identifier: colonyAddress,
      params: [
        motionId,
        ROOT_DOMAIN_ID,
        skillId,
        vote,
        amount,
        key,
        value,
        branchMask,
        siblings,
      ],
      ready: false,
      group: {
        key: 'stakeMotion',
        id: meta.id,
        index: 0,
      },
    });

    yield takeFrom(stakeMotion.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(stakeMotion.id));

    yield takeFrom(stakeMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

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
  yield takeEvery(ActionTypes.MOTION_STAKE, stakeMotionAction);
}
