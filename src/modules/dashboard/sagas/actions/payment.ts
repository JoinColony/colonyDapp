import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
  UserBalanceWithLockDocument,
  getLoggedInUser,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

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

function* createPaymentAction({
  payload: {
    colonyAddress,
    colonyName,
    recipientAddress,
    domainId,
    singlePayment,
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
}: Action<ActionTypes.ACTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the payment
     */
    if (!recipientAddress) {
      throw new Error('Recipient not assigned for OneTxPayment transaction');
    }
    if (!domainId) {
      throw new Error('Domain not set for OneTxPayment transaction');
    }
    if (!singlePayment) {
      throw new Error('Payment details not set for OneTxPayment transaction');
    } else {
      if (!singlePayment.amount) {
        throw new Error('Payment amount not set for OneTxPayment transaction');
      }
      if (!singlePayment.tokenAddress) {
        throw new Error('Payment token not set for OneTxPayment transaction');
      }
      if (!singlePayment.decimals) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
    }

    const { amount, tokenAddress, decimals = 18 } = singlePayment;
    const { walletAddress } = yield getLoggedInUser();

    txChannel = yield call(getTxChannel, metaId);

    /*
     * setup batch ids and channels
     */
    const batchKey = 'paymentAction';

    const {
      paymentAction,
      annotatePaymentAction,
    } = yield createTransactionChannels(metaId, [
      'paymentAction',
      'annotatePaymentAction',
    ]);

    yield fork(createTransaction, paymentAction.id, {
      context: ClientType.OneTxPaymentClient,
      methodName: 'makePaymentFundedFromDomainWithProofs',
      identifier: colonyAddress,
      params: [
        [recipientAddress],
        [tokenAddress],
        [bigNumberify(moveDecimal(amount, decimals))],
        domainId,
        /*
         * NOTE Always make the payment in the global skill 0
         * This will make it so that the user only receives reputation in the
         * above domain, but none in the skill itself.
         */
        0,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotatePaymentAction.id, {
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

    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotatePaymentAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(paymentAction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      paymentAction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotatePaymentAction.id));

      const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);

      yield put(
        transactionAddParams(annotatePaymentAction.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotatePaymentAction.id));

      yield takeFrom(
        annotatePaymentAction.channel,
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
        /*
         * @NOTE Also update the value in "All Domains"
         */
        domainIds: [COLONY_TOTAL_BALANCE_DOMAIN_ID, domainId],
      },
      // Force resolvers to update, as query resolvers are only updated on a cache miss
      // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
      // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      UserBalanceWithLockQuery,
      UserBalanceWithLockQueryVariables
    >({
      query: UserBalanceWithLockDocument,
      variables: {
        address: walletAddress,
        tokenAddress,
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    putError(ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* paymentActionSaga() {
  yield takeEvery(ActionTypes.ACTION_EXPENDITURE_PAYMENT, createPaymentAction);
}
