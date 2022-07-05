import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';

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
  payload: { userAddress, colonyAddress, motionId },
}: Action<ActionTypes.MOTION_FINALIZE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const { provider } = colonyManager;
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    // @NOTE This line exceeds the max-len but there's no prettier solution
    // eslint-disable-next-line max-len
    const votingReputationClient: ExtensionClient = yield colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );
    const motion = yield votingReputationClient.getMotion(motionId);

    const networkEstimate = yield provider.estimateGas({
      from: votingReputationClient.address,
      to:
        /*
         * If the motion target is 0x000... then we pass in the colony's address
         */
        motion.altTarget === AddressZero
          ? colonyClient.address
          : motion.altTarget,
      data: motion.action,
    });

    /*
     * Increase the estimate by 100k WEI. This is a flat increase for all networks
     *
     * @NOTE This will need to be increased further for `setExpenditureState` since
     * that requires even more gas, but since we don't use that one yet, there's
     * no reason to account for it just yet
     */
    const estimate = bigNumberify(networkEstimate).add(bigNumberify(100000));

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
        gasLimit: estimate.toString(),
      }),
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
