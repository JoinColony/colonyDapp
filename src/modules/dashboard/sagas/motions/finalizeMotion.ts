import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { TEMP_getContext, ContextModule } from '~context/index';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import {
  transactionReady,
  transactionUpdateGas,
} from '../../../core/actionCreators';
import { updateMotionValues } from '../utils';

function* finalizeMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, safeChainId },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const { provider } = colonyManager;
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const encodedFinalizeMotion = votingReputationClient.interface.functions[
      'finalizeMotion(uint256)'
    ].encode([motionId]);
    const finalizeEstimate = yield provider.estimateGas({
      from: userAddress,
      to: votingReputationClient.address,
      data: encodedFinalizeMotion,
    });

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

    yield put(
      transactionUpdateGas(finalizeMotionTransaction.id, {
        gasLimit: finalizeEstimate.toString(),
      }),
    );

    yield put(transactionReady(finalizeMotionTransaction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      finalizeMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(
      updateMotionValues,
      colonyAddress,
      userAddress,
      motionId,
      safeChainId,
      txHash,
    );

    yield put<AllActions>({
      type: ActionTypes.MOTION_FINALIZE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_FINALIZE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* finalizeMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_FINALIZE, finalizeMotion);
}
