import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyClient } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { ipfsUploadAnnotation } from '../utils';
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

function* createMoveFundsAction({
  payload: {
    colonyAddress,
    colonyName,
    fromDomainId,
    toDomainId,
    amount,
    tokenAddress,
    annotationMessage,
  },
  meta: {
    id: metaId,
    /*
     * @NOTE About the react router history object
     *
     * Apparently this is considered a best practice when needing to change
     * the route from inside a redux saga, to pass in the history object from
     * the component itself.
     *
     * See:
     * https://reactrouter.com/web/guides/deep-redux-integration
     */
    history,
  },
  meta,
}: Action<ActionTypes.ACTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * Validate the required values for the payment
     */
    if (!fromDomainId) {
      throw new Error(
        'Source domain not set for oveFundsBetweenPots transaction',
      );
    }
    if (!toDomainId) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const [{ fundingPotId: fromPot }, { fundingPotId: toPot }] = yield all([
      call([colonyClient, colonyClient.getDomain], fromDomainId),
      call([colonyClient, colonyClient.getDomain], toDomainId),
    ]);

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'moveFunds';

    const {
      moveFunds,
      annotateMoveFunds,
    } = yield createTransactionChannels(metaId, [
      'moveFunds',
      'annotateMoveFunds',
    ]);

    yield fork(createTransaction, moveFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'moveFundsBetweenPotsWithProofs',
      identifier: colonyAddress,
      params: [fromPot, toPot, amount, tokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFunds.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(moveFunds.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      moveFunds.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateMoveFunds.id));

      const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);

      yield put(transactionAddParams(annotateMoveFunds.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateMoveFunds.id));

      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    // Refetch token balances for the domains involved
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [tokenAddress],
        domainIds: [fromDomainId, toDomainId],
      },
      // Force resolvers to update, as query resolvers are only updated on a cache miss
      // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
      // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* moveFundsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_MOVE_FUNDS, createMoveFundsAction);
}
