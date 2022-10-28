import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import {
  getStringForColonyAvatarImage,
  getStringForMetadataColony,
} from '@colony/colony-event-metadata-parser';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
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

function* editColonyAction({
  payload: {
    colonyAddress,
    colonyName,
    colonyDisplayName,
    colonyAvatarImage,
    colonyAvatarHash,
    hasAvatarChanged,
    colonyTokens = [],
    annotationMessage,
    verifiedAddresses,
    isWhitelistActivated,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_EDIT_COLONY>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the payment
     */
    if (!colonyDisplayName && colonyDisplayName !== null) {
      throw new Error('A colony name is required in order to edit the colony');
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
     *
     * @NOTE Only (re)upload the avatar if it has changed, otherwise just use
     * the old hash.
     * This cuts down on some transaction signing wait time, since IPFS uplaods
     * tend to be on the slower side :(
     */
    let colonyAvatarIpfsHash = null;
    if (colonyAvatarImage && hasAvatarChanged) {
      colonyAvatarIpfsHash = yield call(
        ipfsUploadWithFallback,
        getStringForColonyAvatarImage(colonyAvatarImage),
      );
    }

    let colonyMetadataIpfsHash = null;
    const colonyMetadata = getStringForMetadataColony({
      colonyDisplayName,
      colonyAvatarHash: hasAvatarChanged
        ? colonyAvatarIpfsHash
        : colonyAvatarHash,
      colonyTokens,
      verifiedAddresses,
      isWhitelistActivated,
    });

    /*
     * Upload colony metadata to IPFS
     */
    colonyMetadataIpfsHash = yield call(ipfsUploadWithFallback, colonyMetadata);

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
        variables: { name: colonyName || '', address: colonyAddress },
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
      colonyAvatarIpfsHash,
      colonyAvatarImage as string | null,
    );

    yield put<AllActions>({
      type: ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_EDIT_COLONY_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* editColonyActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EDIT_COLONY, editColonyAction);
}
