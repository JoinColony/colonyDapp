import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';
import { updateMotionValues } from '../utils';
import { ContextModule, TEMP_getContext } from '~context/index';

function* escalateMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId },
}: Action<ActionTypes.MOTION_ESCALATE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      ROOT_DOMAIN_ID,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    const {
      escalateMotionTransaction,
    } = yield createTransactionChannels(meta.id, ['escalateMotionTransaction']);

    const batchKey = 'escalateMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(escalateMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'escalateMotionWithProofs',
      identifier: colonyAddress,
      params: [
        motionId,
        /*
         * We can only escalate the motion in a parent domain, and all current
         * sub-domains have ROOT as the parent domain
         */
        ROOT_DOMAIN_ID,
        key,
        value,
        branchMask,
        siblings,
      ],
      ready: false,
    });

    yield takeFrom(
      escalateMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(escalateMotionTransaction.id));

    yield takeFrom(
      escalateMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_ESCALATE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_ESCALATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* escalateMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_ESCALATE, escalateMotion);
}
