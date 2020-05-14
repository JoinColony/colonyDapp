import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  CreateTaskDocument,
  CreateTaskMutationResult,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  cacheUpdates,
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  SetTaskPendingDocument,
  SetTaskPendingMutation,
  SetTaskPendingMutationVariables,
} from '~data/index';
import { Action, ActionTypes } from '~redux/index';
// import { getLogsAndEvents, parseTaskPayoutEvents } from '~utils/web3/eventLogs';
import { putError, takeFrom } from '~utils/saga/effects';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { createTransaction, getTxChannel } from '../../core/sagas';

import { AllActions } from '../../../redux/types/actions';

function* taskCreate({
  meta,
  payload: { colonyAddress, ethDomainId },
}: Action<ActionTypes.TASK_CREATE>) {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
    persistent = false,
  },
  meta,
}: Action<ActionTypes.TASK_FINALIZE>) {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
      context: ClientType.ColonyClient,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: {
        recipient: workerAddress,
        token,
        amount: bigNumberify(moveDecimal(amount, decimals)),
        domainId,
        skillId: skillId || 0,
      },
    });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    if (!persistent) {
      /*
       * @NOTE Put the task in a pending state
       */
      yield apolloClient.mutate<
        SetTaskPendingMutation,
        SetTaskPendingMutationVariables
      >({
        mutation: SetTaskPendingDocument,
        variables: {
          input: {
            id: draftId,
            txHash,
          },
        },
      });
    }

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

/*
 * @NOTE Check if a pending task's transaction was mined in the background
 */
// FIXME
// function* taskComplete({
//   payload: { colonyAddress, txHash },
//   meta,
// }: Action<ActionTypes.TASK_TRANSACTION_COMPLETED_FETCH>) {
//   try {
//     const colonyManager: ColonyManager = yield getContext(
//       Context.COLONY_MANAGER,
//     );
//     const colonyClient: ColonyClient = yield colonyManager.getColonyClient(
//       colonyAddress,
//     );
//     const {
//       events: { PayoutClaimed },
//     } = colonyClient;
//     const { events, logs } = yield getLogsAndEvents(
//       colonyClient,
//       {
//         address: colonyAddress,
//         fromBlock: 1,
//       },
//       {
//         events: [PayoutClaimed],
//       },
//     );

//     const transactions = yield Promise.all(
//       logs.map((log, i) =>
//         parseTaskPayoutEvents({
//           event: events[i],
//           log,
//           colonyClient,
//           colonyAddress,
//           taskTxHash: txHash,
//         }),
//       ),
//     );

//     const [parsedTransaction] = transactions.filter(Boolean);

//     const { potId } = parsedTransaction || { potId: undefined };

//     if (!potId) {
//       return null;
//     }

//     yield put<AllActions>({
//       type: ActionTypes.TASK_TRANSACTION_COMPLETED_FETCH_SUCCESS,
//       meta,
//       payload: { potId },
//     });
//   } catch (error) {
//     return yield putError(
//       ActionTypes.COLONY_TRANSACTIONS_FETCH_ERROR,
//       error,
//       meta,
//     );
//   }
//   return null;
// }

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
  // FIXME
  // yield takeEvery(ActionTypes.TASK_TRANSACTION_COMPLETED_FETCH, taskComplete);
}
