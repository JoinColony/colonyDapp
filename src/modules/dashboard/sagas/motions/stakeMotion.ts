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
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

import { updateMotionValues, ipfsUploadAnnotation } from '../utils';

function* stakeMotion({
  meta,
  payload: {
    userAddress,
    colonyAddress,
    motionId,
    vote,
    amount,
    annotationMessage,
  },
}: Action<ActionTypes.MOTION_STAKE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield context.getClient(
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

    const {
      approveStake,
      stakeMotionTransaction,
      annotateStaking,
    } = yield createTransactionChannels(meta.id, [
      'approveStake',
      'stakeMotionTransaction',
      'annotateStaking',
    ]);

    const batchKey = 'stakeMotion';

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
      params: [votingReputationClient.address, domainId, amount],
      ready: false,
    });

    yield createGroupTransaction(stakeMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'stakeMotionWithProofs',
      identifier: colonyAddress,
      params: [motionId, vote, amount, key, value, branchMask, siblings],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateStaking, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    if (annotationMessage) {
      yield takeFrom(annotateStaking.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield put(transactionReady(approveStake.id));

    yield takeFrom(approveStake.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(transactionReady(stakeMotionTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      stakeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (annotationMessage) {
      yield put(transactionPending(annotateStaking.id));

      /*
       * Upload annotation metadata to IPFS
       */
      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage || '',
      );

      yield put(
        transactionAddParams(annotateStaking.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateStaking.id));

      yield takeFrom(
        annotateStaking.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

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
