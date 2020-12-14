import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { createTransaction, getTxChannel } from '../../core/sagas';

function* createPaymentAction({
  payload: {
    colonyAddress,
    colonyName,
    recipientAddress,
    domainId,
    singlePayment,
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
}: Action<ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT>) {
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

    const txChannel = yield call(getTxChannel, metaId);

    yield fork(createTransaction, metaId, {
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
    });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Redirect the user to the actions page
     */
    if (history && colonyName) {
      yield call(history.push, `/colony/${colonyName}/tx/${txHash}`);
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

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR,
      error,
      meta,
    );
  }
  return null;
}

export default function* tasksSagas() {
  yield takeEvery(
    ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT,
    createPaymentAction,
  );
}
