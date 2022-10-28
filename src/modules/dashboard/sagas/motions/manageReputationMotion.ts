import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  getChildIndex,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';

import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

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
import { updateDomainReputation, ipfsUploadAnnotation } from '../utils';

function* manageReputationMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    annotationMessage,
    motionDomainId,
    isSmitingReputation,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_MANAGE_REPUTATION>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!userAddress) {
      throw new Error(
        'A user address is required to manage the reputation of the user',
      );
    }
    if (!domainId) {
      throw new Error(
        'A domain id is required to manage the reputation of the user',
      );
    }
    if (!amount) {
      throw new Error(
        'A reputation amount is required to manage the reputation of the user',
      );
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const votingReputationClient = yield context.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      domainId,
      ColonyRole.Architecture,
      votingReputationClient.address,
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
      annotateManageReputationMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateManageReputationMotion',
    ]);

    let encodedAction;

    if (isSmitingReputation) {
      // eslint-disable-next-line max-len
      encodedAction = colonyClient.interface.functions.emitDomainReputationPenalty.encode(
        [permissionDomainId, childSkillIndex, domainId, userAddress, amount],
      );
    } else {
      // eslint-disable-next-line max-len
      encodedAction = colonyClient.interface.functions.emitDomainReputationReward.encode(
        [domainId, userAddress, amount],
      );
    }

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
      yield fork(createTransaction, annotateManageReputationMotion.id, {
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

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield takeFrom(
        annotateManageReputationMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );

      /*
       * Upload annotation to IPFS
       */
      const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);

      yield put(transactionPending(annotateManageReputationMotion.id));

      yield put(
        transactionAddParams(annotateManageReputationMotion.id, [
          txHash,
          ipfsHash,
        ]),
      );

      yield put(transactionReady(annotateManageReputationMotion.id));

      yield takeFrom(
        annotateManageReputationMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Refesh the user & colony reputation
     */
    yield fork(updateDomainReputation, colonyAddress, userAddress, domainId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    putError(ActionTypes.MOTION_MANAGE_REPUTATION_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* manageReputationMotionSage() {
  yield takeEvery(ActionTypes.MOTION_MANAGE_REPUTATION, manageReputationMotion);
}
