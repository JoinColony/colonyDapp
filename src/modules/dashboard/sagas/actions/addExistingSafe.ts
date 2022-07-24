import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
  SubgraphColonyDocument,
  SubgraphColonyQuery,
  SubgraphColonyQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { uploadIfpsAnnotation } from '../utils';
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

function* addExistingSafeAction({
  payload: {
    colonyName,
    colonyAddress,
    chainId,
    safeName,
    contractAddress,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_ADD_EXISTING_SAFE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const ipfsWithFallback = TEMP_getContext(ContextModule.IPFSWithFallback);

    if (!contractAddress) {
      throw new Error('A contract address is required to add an existing safe');
    }

    txChannel = yield call(getTxChannel, metaId);
    const batchKey = 'addExistingSafe';
    const {
      addExistingSafeAction: addExistingSafe,
      annotateAddExistingSafeAction: annotateAddExistingSafe,
    } = yield createTransactionChannels(metaId, [
      'addExistingSafeAction',
      'annotateAddExistingSafeAction',
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

    yield createGroupTransaction(addExistingSafe, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateAddExistingSafe, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(addExistingSafe.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateAddExistingSafe.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(addExistingSafe.id));

    /*
     * Fetch colony data from the subgraph
     * And destructure the metadata hash.
     */

    const {
      data: {
        colony: { metadata: currentMetadataIPFSHash },
      },
    } = yield apolloClient.query<
      SubgraphColonyQuery,
      SubgraphColonyQueryVariables
    >({
      query: SubgraphColonyDocument,
      variables: {
        address: colonyAddress.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    });

    let updatatedColonyMetadata: any = {};
    const safeData = { safeName, contractAddress, chainId };

    /*
     * If there isn't metadata in the colony ...
     */

    if (!currentMetadataIPFSHash) {
      /*
       * ... add the safe to a new metadata object.
       */

      updatatedColonyMetadata = { colonySafes: [safeData] };
    } else {
      /*
       *  ... otherwise, fetch the metadata from IPFS...
       */

      const currentMetadata = yield call(
        ipfsWithFallback.getString,
        currentMetadataIPFSHash,
      );

      const colonyMetadata = JSON.parse(currentMetadata);
      const safes = colonyMetadata.colonySafes;
      updatatedColonyMetadata = {
        ...colonyMetadata,
        colonySafes: safes
          ? [...colonyMetadata.colonySafes, safeData]
          : [safeData],
      };
    }

    /*
     * Upload updated metadata object to IPFS
     */

    const updatedColonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify(updatatedColonyMetadata),
    );

    yield put(
      transactionAddParams(addExistingSafe.id, [
        (updatedColonyMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(addExistingSafe.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      addExistingSafe.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(addExistingSafe.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateAddExistingSafe.id));

      /*
       * Upload annotationMessage to IPFS
       */
      const annotationMessageIpfsHash = yield call(
        uploadIfpsAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateAddExistingSafe.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateAddExistingSafe.id));

      yield takeFrom(
        annotateAddExistingSafe.channel,
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

    yield put<AllActions>({
      type: ActionTypes.ACTION_ADD_EXISTING_SAFE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_ADD_EXISTING_SAFE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* addExistingSafeSaga() {
  yield takeEvery(
    ActionTypes.ACTION_ADD_EXISTING_SAFE,
    addExistingSafeAction,
  );
}
