import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import isEmpty from 'lodash/isEmpty';
import {
  getStringForMetadataColony,
  getEventMetadataVersion,
} from '@colony/colony-event-metadata-parser';

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

import { ipfsUploadAnnotation, ipfsUploadWithFallback } from '../utils';

function* manageExistingSafesAction({
  payload: {
    colonyName,
    colonyAddress,
    safeList,
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

    if (isEmpty(safeList)) {
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

    if (!currentMetadata) {
      throw new Error(
        `There was an error while fetching the current colony metadata. Please try again later.`,
      );
    }

    const parsedColonyMetadata = JSON.parse(currentMetadata);
    const metadataVersion = getEventMetadataVersion(currentMetadata);
    const currentColonyMetadata =
      metadataVersion === 1
        ? { ...parsedColonyMetadata }
        : parsedColonyMetadata.data;

    let updatedColonyMetadata: any = {};

    if (!isRemovingSafes) {
      updatedColonyMetadata = {
        ...currentColonyMetadata,
        colonySafes: currentColonyMetadata.colonySafes
          ? [...currentColonyMetadata.colonySafes, ...safeList]
          : safeList,
      };
    } else {
      const updatedColonySafes = currentColonyMetadata.colonySafes.filter(
        (safe: ColonySafe) =>
          !safeList.some(
            (removedSafe) =>
              removedSafe.contractAddress === safe.contractAddress &&
              removedSafe.chainId === safe.chainId,
          ),
      );
      updatedColonyMetadata = {
        ...currentColonyMetadata,
        colonySafes: updatedColonySafes,
      };
    }

    const colonyMetadata = getStringForMetadataColony(updatedColonyMetadata);
    /*
     * Upload updated metadata object to IPFS
     */

    const updatedColonyMetadataIpfsHash = yield call(
      ipfsUploadWithFallback,
      colonyMetadata,
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
        ipfsUploadAnnotation,
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
