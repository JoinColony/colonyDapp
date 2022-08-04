import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import isEmpty from 'lodash/isEmpty';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
  ColonySafe,
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

function* manageExistingSafesAction({
  payload: {
    colonyName,
    colonyAddress,
    safeAddresses,
    annotationMessage,
    isRemovingSafes,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_MANAGE_EXISTING_SAFES>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const ipfsWithFallback = TEMP_getContext(ContextModule.IPFSWithFallback);

    if (isEmpty(safeAddresses)) {
      throw new Error('A list with safe addresses is required to manage safes');
    }

    txChannel = yield call(getTxChannel, metaId);
    const batchKey = !isRemovingSafes
      ? 'addExistingSafe'
      : 'removeExistingSafes';
    const {
      manageExistingSafesAction: manageExistingSafes,
      annotateManageExistingSafesAction: annotateManageExistingSafes,
    } = yield createTransactionChannels(metaId, [
      'manageExistingSafesAction',
      'annotateManageExistingSafesAction',
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

    yield createGroupTransaction(manageExistingSafes, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateManageExistingSafes, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateManageExistingSafes.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(manageExistingSafes.id));

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

    const currentMetadata = yield call(
      ipfsWithFallback.getString,
      currentMetadataIPFSHash,
    );

    const colonyMetadata = JSON.parse(currentMetadata);

    let updatedColonyMetadata: any = {};

    if (!isRemovingSafes) {
      updatedColonyMetadata = {
        ...colonyMetadata,
        colonySafes: colonyMetadata.colonySafes
          ? [...colonyMetadata.colonySafes, ...safeAddresses]
          : safeAddresses,
      };
    } else {
      const updatedColonySafes = colonyMetadata.colonySafes.filter(
        (safe: ColonySafe) =>
          !safeAddresses.some(
            (safeAddress) => safeAddress === safe.contractAddress,
          ),
      );
      updatedColonyMetadata = {
        ...colonyMetadata,
        colonySafes: updatedColonySafes,
      };
    }

    /*
     * Upload updated metadata object to IPFS
     */

    const updatedColonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify(updatedColonyMetadata),
    );

    yield put(
      transactionAddParams(manageExistingSafes.id, [
        (updatedColonyMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(manageExistingSafes.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      manageExistingSafes.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (annotationMessage) {
      yield put(transactionPending(annotateManageExistingSafes.id));

      /*
       * Upload annotationMessage to IPFS
       */
      const annotationMessageIpfsHash = yield call(
        uploadIfpsAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateManageExistingSafes.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateManageExistingSafes.id));

      yield takeFrom(
        annotateManageExistingSafes.channel,
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
      type: ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR,
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
    ActionTypes.ACTION_MANAGE_EXISTING_SAFES,
    manageExistingSafesAction,
  );
}
