import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  UserReputationQuery,
  UserReputationQueryVariables,
  UserReputationDocument,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

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

function* smiteAction({
  payload: {
    colonyAddress,
    colonyName,
    domainId,
    userAddress,
    amount,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_SMITE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    if (!userAddress) {
      throw new Error(
        'User address not set for emitDomainReputationPenalty transaction',
      );
    }

    if (!domainId) {
      throw new Error(
        'Domain id not set for emitDomainReputationPenalty transaction',
      );
    }

    if (!colonyAddress) {
      throw new Error(
        'Colony address not set for emitDomainReputationPenalty transaction',
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'emitDomainReputationPenalty';

    const {
      emitDomainReputationPenalty,
      annotateEmitDomainReputationPenalty,
    } = yield createTransactionChannels(metaId, [
      'emitDomainReputationPenalty',
      'annotateEmitDomainReputationPenalty',
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

    yield createGroupTransaction(emitDomainReputationPenalty, {
      context: ClientType.ColonyClient,
      methodName: 'emitDomainReputationPenaltyWithProofs',
      identifier: colonyAddress,
      params: [domainId, userAddress, amount],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEmitDomainReputationPenalty, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(
      emitDomainReputationPenalty.channel,
      ActionTypes.TRANSACTION_CREATED,
    );
    if (annotationMessage) {
      yield takeFrom(
        annotateEmitDomainReputationPenalty.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(emitDomainReputationPenalty.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      emitDomainReputationPenalty.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(
      emitDomainReputationPenalty.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    if (annotationMessage) {
      yield put(transactionPending(annotateEmitDomainReputationPenalty.id));

      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

      yield put(
        transactionAddParams(annotateEmitDomainReputationPenalty.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateEmitDomainReputationPenalty.id));

      yield takeFrom(
        annotateEmitDomainReputationPenalty.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield apolloClient.query<UserReputationQuery, UserReputationQueryVariables>(
      {
        query: UserReputationDocument,
        variables: {
          colonyAddress,
          address: userAddress,
          domainId,
        },
        fetchPolicy: 'network-only',
      },
    );

    yield apolloClient.query<UserReputationQuery, UserReputationQueryVariables>(
      {
        query: UserReputationDocument,
        variables: {
          colonyAddress,
          address: AddressZero,
          domainId,
        },
        fetchPolicy: 'network-only',
      },
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_SMITE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ACTION_SMITE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* smiteActionSaga() {
  yield takeEvery(ActionTypes.COLONY_ACTION_SMITE, smiteAction);
}
