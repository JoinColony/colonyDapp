import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  ProcessedColonyDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';
import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';

function* enterRecoveryAction({
  payload: { colonyAddress, colonyName, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_RECOVERY>) {
  let txChannel;

  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'recoveryAction';
    const {
      recoveryAction,
      annotateRecoveryAction,
    } = yield createTransactionChannels(metaId, [
      'recoveryAction',
      'annotateRecoveryAction',
    ]);

    yield fork(createTransaction, recoveryAction.id, {
      context: ClientType.ColonyClient,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateRecoveryAction.id, {
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

    yield takeFrom(recoveryAction.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateRecoveryAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(recoveryAction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      recoveryAction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(recoveryAction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateRecoveryAction.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

      yield put(
        transactionAddParams(annotateRecoveryAction.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateRecoveryAction.id));

      yield takeFrom(
        annotateRecoveryAction.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield apolloClient.query<
      ProcessedColonyQuery,
      ProcessedColonyQueryVariables
    >({
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.COLONY_ACTION_RECOVERY_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_RECOVERY_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* enterRecoveryActionSaga() {
  yield takeEvery(ActionTypes.COLONY_ACTION_RECOVERY, enterRecoveryAction);
}
