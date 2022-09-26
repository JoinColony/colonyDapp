import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

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

function* manageReputationAction({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    isSmitingReputation,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_REPUTATION>) {
  let txChannel;
  try {
    const batchKey = isSmitingReputation
      ? 'emitDomainReputationPenalty'
      : 'emitDomainReputationReward';

    if (!userAddress) {
      throw new Error(`User address not set for ${batchKey} transaction`);
    }

    if (!domainId) {
      throw new Error(`Domain id not set for ${batchKey} transaction`);
    }

    if (!colonyAddress) {
      throw new Error(`Colony address not set for ${batchKey} transaction`);
    }

    txChannel = yield call(getTxChannel, metaId);

    const {
      manageReputation,
      annotateManageReputation,
    } = yield createTransactionChannels(metaId, [
      'manageReputation',
      'annotateManageReputation',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    yield createGroupTransaction(manageReputation, {
      context: ClientType.ColonyClient,
      methodName: isSmitingReputation
        ? 'emitDomainReputationPenaltyWithProofs'
        : 'emitDomainReputationReward',
      identifier: colonyAddress,
      params: [domainId, userAddress, amount],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateManageReputation, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateManageReputation.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(manageReputation.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageReputation.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(manageReputation.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateManageReputation.id));

      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateManageReputation.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateManageReputation.id));

      yield takeFrom(
        annotateManageReputation.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Refesh the user & colony reputation
     */
    yield fork(updateDomainReputation, colonyAddress, userAddress, domainId);

    yield put<AllActions>({
      type: ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_REPUTATION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageReputationActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MANAGE_REPUTATION, manageReputationAction);
}
