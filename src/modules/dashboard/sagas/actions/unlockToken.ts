import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, routeRedirect, takeFrom } from '~utils/saga/effects';
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
import { ipfsUploadAnnotation } from '../utils';

function* tokenUnlockAction({
  meta,
  meta: { id: metaId, history },
  payload: { colonyAddress, annotationMessage, colonyName },
}: Action<ActionTypes.ACTION_UNLOCK_TOKEN>) {
  let txChannel;

  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'tokenUnlockAction';
    const {
      tokenUnlockAction: tokenUnlock,
      annotateTokenUnlockAction: annotateTokenUnlock,
    } = yield createTransactionChannels(metaId, [
      'tokenUnlockAction',
      'annotateTokenUnlockAction',
    ]);

    /*
     * Create a grouped transaction
     */
    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    /*
     * Add the tokenUnlock transaction to the group
     */

    yield createGroupTransaction(tokenUnlock, {
      context: ClientType.ColonyClient,
      methodName: 'unlockToken',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    /*
     * If annotation message exists add the transaction to the group
     */

    if (annotationMessage) {
      yield createGroupTransaction(annotateTokenUnlock, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    /*
     * Wait for transactions to be created
     */

    yield takeFrom(tokenUnlock.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateTokenUnlock.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    /*
     * Check for transaction and wait for response
     */

    yield put(transactionReady(tokenUnlock.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      tokenUnlock.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(tokenUnlock.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateTokenUnlock.id));

      /*
       * Upload annotation metadata to IPFS
       */
      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateTokenUnlock.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateTokenUnlock.id));

      yield takeFrom(
        annotateTokenUnlock.channel,
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

    yield put<AllActions>({
      type: ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    putError(ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* unlockTokenActionSaga() {
  yield takeEvery(ActionTypes.ACTION_UNLOCK_TOKEN, tokenUnlockAction);
}
