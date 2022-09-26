import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { getStringForMetadataColony } from '@colony/colony-event-metadata-parser';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
  ColonyFromNameDocument,
} from '~data/index';
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

import {
  updateColonyDisplayCache,
  ipfsUploadWithFallback,
  ipfsUploadAnnotation,
} from '../utils';

function* manageVerifiedRecipients({
  payload: {
    colonyName,
    colonyAddress,
    colonyDisplayName,
    colonyAvatarHash,
    verifiedAddresses = [],
    colonyTokens = [],
    annotationMessage,
    isWhitelistActivated,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.VERIFIED_RECIPIENTS_MANAGE>) {
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
      ipfsUploadWithFallback,
      getStringForMetadataColony({
        colonyDisplayName,
        colonyAvatarHash,
        verifiedAddresses,
        colonyTokens,
        isWhitelistActivated,
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
        ipfsUploadAnnotation,
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
    yield apolloClient.query<ColonyFromNameQuery, ColonyFromNameQueryVariables>(
      {
        query: ColonyFromNameDocument,
        variables: {
          name: colonyName,
          address: colonyAddress,
        },
        fetchPolicy: 'network-only',
      },
    );

    /*
     * Update apollo's cache for the current colony to reflect the recently
     * made changes
     */
    yield updateColonyDisplayCache(
      colonyAddress,
      colonyDisplayName,
      colonyAvatarHash,
      null,
    );

    yield put<AllActions>({
      type: ActionTypes.VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      payload: {},
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE_ERROR,
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
    ActionTypes.VERIFIED_RECIPIENTS_MANAGE,
    manageVerifiedRecipients,
  );
}
