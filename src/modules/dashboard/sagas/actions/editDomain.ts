import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { getStringForMetadataDomain } from '@colony/colony-event-metadata-parser';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { ipfsUploadAnnotation, ipfsUploadWithFallback } from '../utils';
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

function* editDomainAction({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_EDIT>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    if (!domainId) {
      throw new Error('A domain id is required to edit domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editDomainAction';
    const {
      editDomainAction: editDomain,
      annotateEditDomainAction: annotateEditDomain,
    } = yield createTransactionChannels(metaId, [
      'editDomainAction',
      'annotateEditDomainAction',
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

    yield createGroupTransaction(editDomain, {
      context: ClientType.ColonyClient,
      methodName: 'editDomainWithProofs',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditDomain, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(editDomain.id));

    /*
     * Upload domain metadata to IPFS
     */
    let domainMetadataIpfsHash = null;
    domainMetadataIpfsHash = yield call(
      ipfsUploadWithFallback,
      getStringForMetadataDomain({
        domainName,
        domainColor,
        domainPurpose,
      }),
    );

    yield put(
      transactionAddParams(editDomain.id, [
        domainId,
        (domainMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(editDomain.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateEditDomain.id));

      /*
       * Upload annotationMessage to IPFS
       */
      const annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateEditDomain.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateEditDomain.id));

      yield takeFrom(
        annotateEditDomain.channel,
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
      type: ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_DOMAIN_EDIT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* editDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_EDIT, editDomainAction);
}
