import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ROOT_DOMAIN_ID } from '@colony/colony-js';
import { getStringForMetadataDomain } from '@colony/colony-event-metadata-parser';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { ipfsUploadWithFallback, ipfsUploadAnnotation } from '../utils';

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

function* createDomainAction({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    parentId = ROOT_DOMAIN_ID,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_DOMAIN_CREATE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'createDomainAction';
    const {
      createDomainAction: createDomain,
      annotateCreateDomainAction: annotateCreateDomain,
    } = yield createTransactionChannels(metaId, [
      'createDomainAction',
      'annotateCreateDomainAction',
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

    yield createGroupTransaction(createDomain, {
      context: ClientType.ColonyClient,
      methodName: 'addDomainWithProofs',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateCreateDomain, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(createDomain.id));

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
      transactionAddParams(createDomain.id, [
        parentId,
        (domainMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(createDomain.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateCreateDomain.id));

      /*
       * Upload annotaiton to IPFS
       */
      const annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateCreateDomain.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateCreateDomain.id));

      yield takeFrom(
        annotateCreateDomain.channel,
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
      type: ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* createDomainActionSaga() {
  yield takeEvery(ActionTypes.ACTION_DOMAIN_CREATE, createDomainAction);
}
