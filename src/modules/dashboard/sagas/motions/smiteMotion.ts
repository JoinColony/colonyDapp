import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getChildIndex } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';
import { updateUserReputation } from '../utils';

function* smiteMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    annotationMessage,
    motionDomainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_MOTION_SMITE>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!userAddress) {
      throw new Error('A user address is required to smite this user');
    }
    if (!domainId) {
      throw new Error('Domain id not set for Smite transaction');
    }
    if (!amount) {
      throw new Error('Amount not set for Smite transaction');
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      motionDomainId,
      domainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const {
      createMotion,
      annotateSmiteMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateSmiteMotion',
    ]);

    // eslint-disable-next-line max-len
    const encodedAction = colonyClient.interface.functions.emitSkillReputationPenalty.encode(
      [skillId, userAddress, amount],
    );

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateSmiteMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateSmiteMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    let ipfsHash = null;
    ipfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        annotationMessage,
      }),
    );

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateSmiteMotion.id));

      yield put(
        transactionAddParams(annotateSmiteMotion.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateSmiteMotion.id));

      yield takeFrom(
        annotateSmiteMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Refesh the user reputation
     */
    yield fork(updateUserReputation, colonyAddress, userAddress, domainId);

    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_SMITE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    putError(ActionTypes.COLONY_MOTION_SMITE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* smiteMotionSage() {
  yield takeEvery(ActionTypes.COLONY_MOTION_SMITE, smiteMotion);
}
