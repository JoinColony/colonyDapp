import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

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
import { uploadIfpsAnnotation } from '../utils';

function* manageVerifiedRecipients({
  payload: {
    colonyAddress,
    colonyDisplayName,
    colonyAvatarHash,
    verifiedAddresses = [],
    annotationMessage,
  },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the transaction
     */
    if (!colonyDisplayName && colonyDisplayName !== null) {
      throw new Error(
        `A colony name is required in order to add whitelist addresses to the colony`,
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editColonyAction';
    const {
      editColonyAction: editColony,
      annotateEditColonyAction: annotateEditColony,
    } = yield createTransactionChannels(metaId, [
      'editColonyAction',
      'annotateEditColonyAction',
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

    yield createGroupTransaction(editColony, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditColony, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_CREATED);

    if (annotationMessage) {
      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(editColony.id));

    /*
     * Upload colony metadata to IPFS
     */
    let colonyMetadataIpfsHash = null;
    colonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        colonyDisplayName,
        colonyAvatarHash,
        verifiedAddresses,
      }),
    );

    yield put(
      transactionAddParams(editColony.id, [
        (colonyMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(editColony.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateEditColony.id));

      /*
       * Upload annotation metadata to IPFS
       */
      const annotationMessageIpfsHash = yield call(
        uploadIfpsAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateEditColony.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateEditColony.id));

      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Update the colony object cache
     */
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
      type: ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      payload: {},
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* manageVerifiedRecipientsSaga() {
  yield takeEvery(
    ActionTypes.COLONY_VERIFIED_RECIPIENTS_MANAGE,
    manageVerifiedRecipients,
  );
}
