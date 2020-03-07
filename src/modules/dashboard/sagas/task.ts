import ApolloClient from 'apollo-client';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import { Context, getContext } from '~context/index';
import {
  CreateTaskDocument,
  CreateTaskMutationResult,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  cacheUpdates,
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';
import { Action, ActionTypes } from '~redux/index';
import { ContractContexts } from '~types/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

import { createTransaction, getTxChannel } from '../../core/sagas';

import { AllActions } from '../../../redux/types/actions';

function* taskCreate({
  meta,
  payload: { colonyAddress, ethDomainId },
}: Action<ActionTypes.TASK_CREATE>) {
  try {
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data }: CreateTaskMutationResult = yield apolloClient.mutate<
      CreateTaskMutation,
      CreateTaskMutationVariables
    >({
      mutation: CreateTaskDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId,
        },
      },
      update: cacheUpdates.createTask(colonyAddress),
    });

    if (!data || !data.createTask) throw new Error('Could not create task');

    const { id } = data.createTask;

    const successAction: Action<ActionTypes.TASK_CREATE_SUCCESS> = {
      type: ActionTypes.TASK_CREATE_SUCCESS,
      payload: { id },
      meta,
    };

    /*
     * Put the success action and redirect to the task
     */

    yield put(successAction);
  } catch (error) {
    return yield putError(ActionTypes.TASK_CREATE_ERROR, error, meta);
  }
  return null;
}

/*
 * As manager, finalize task (`completeTask` group)
 */
function* taskFinalize({
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
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
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
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: {
        recipient: workerAddress,
        token,
        amount: new BigNumber(moveDecimal(amount, decimals)),
        domainId,
        skillId: skillId || 0,
      },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_RECEIPT_RECEIVED);

    const {
      payload: {
        eventData: { potId },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

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
      payload: { potId, draftId },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_FINALIZE_ERROR, error, meta);
  }
  return null;
}

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
}
