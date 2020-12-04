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
    draftId,
    workerAddress,
    domainId,
    skillId,
    payouts,
  },
  meta,
}: Action<ActionTypes.TASK_FINALIZE>) {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    if (!workerAddress)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!domainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const {
      amount,
      token: { address: token, decimals },
    } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ClientType.OneTxPaymentClient,
      methodName: 'makePaymentFundedFromDomainWithProofs',
      identifier: colonyAddress,
      params: [
        [workerAddress],
        [token],
        bigNumberify(moveDecimal(amount, decimals)),
        domainId,
        skillId || 0,
      ],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    const {
      payload: {
        receipt: { logs },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    // We need to manually parse the logs as the events are not emitted on the OneTxPayment contract
    const events = logs.map((log) => colonyClient.interface.parseLog(log));
    const potAddedEvent = events.find((evt) => evt.name === 'FundingPotAdded');

    if (!potAddedEvent) {
      throw new Error('No corresponding potId found. Can not finalize task');
    }

    const {
      values: { fundingPotId },
    } = potAddedEvent;

    // Refetch token balances for the domains involved
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [token],
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
      type: ActionTypes.TASK_FINALIZE_SUCCESS,
      payload: { potId: fundingPotId.toNumber(), draftId },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_FINALIZE_ERROR, error, meta);
  }
  return null;
}

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_FINALIZE, createPaymentAction);
}
