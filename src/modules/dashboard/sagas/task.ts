import ApolloClient from 'apollo-client';
import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import BigNumber from 'bn.js';

import { Context, getContext } from '~context/index';
import {
  AssignWorkerDocument,
  CreateTaskDocument,
  FinalizeTaskDocument,
  RemoveTaskPayoutDocument,
  SetTaskPayoutDocument,
  TaskDocument,
  UnassignWorkerDocument,
  SendTaskMessageDocument,
  SendTaskMessageMutation,
  SendTaskMessageMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  TaskQuery,
  TaskQueryVariables,
  FinalizeTaskMutation,
  FinalizeTaskMutationVariables,
  AssignWorkerMutation,
  AssignWorkerMutationVariables,
  UnassignWorkerMutation,
  UnassignWorkerMutationVariables,
  SetTaskPayoutMutation,
  SetTaskPayoutMutationVariables,
  RemoveTaskPayoutMutation,
  RemoveTaskPayoutMutationVariables,
  TaskFeedEventsDocument,
  ColonyTasksDocument,
} from '~data/index';
import { TaskPayoutType } from '~immutable/TaskPayout';
import { Action, ActionTypes } from '~redux/index';
import { Address, ContractContexts } from '~types/index';
import { putError, raceError, takeFrom } from '~utils/saga/effects';

import { fetchColonyTaskMetadata as fetchColonyTaskMetadataAC } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonyTaskMetadataSelector,
} from '../selectors';
import { createTransaction, getTxChannel, signMessage } from '../../core/sagas';

import { AllActions } from '../../../redux/types/actions';

/*
 * Dispatch an action to fetch the colony task metadata and wait for the
 * success/error action.
 */
export function* fetchColonyTaskMetadata(colonyAddress: Address) {
  const metadata = yield select(colonyTaskMetadataSelector, colonyAddress);

  /*
   * Dispatch an action to fetch the task metadata for this colony
   * (if necessary).
   */
  if (metadata == null || metadata.error || !metadata.isFetching) {
    yield put(fetchColonyTaskMetadataAC(colonyAddress));

    /*
     * Wait for any success/error action of this type; this may not be from
     * the action dispatched above, because it could have been from a previously
     * dispatched action that did not block the UI.
     */
    return yield raceError(
      (action: AllActions) =>
        action.type === ActionTypes.COLONY_TASK_METADATA_FETCH_SUCCESS &&
        action.meta.key === colonyAddress,
      (action: AllActions) =>
        action.type === ActionTypes.COLONY_TASK_METADATA_FETCH_ERROR &&
        action.meta.key === colonyAddress,
    );
  }

  return null;
}

function* taskCreate({
  meta,
  payload: { colonyAddress, colonyName, ethDomainId },
}: Action<ActionTypes.TASK_CREATE>) {
  try {
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const {
      data: { createTask },
    } = yield apolloClient.mutate<
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
      refetchQueries: [
        { query: ColonyTasksDocument, variables: { address: colonyAddress } },
      ]
    });

    // Not sure what to use for task slug - `id` or `ethTaskId`. Will these be the same?
    const { id } = createTask;

    const successAction: Action<ActionTypes.TASK_CREATE_SUCCESS> = {
      type: ActionTypes.TASK_CREATE_SUCCESS,
    };

    /*
     * Put the success action, subscribe to the task and redirect to it
     */
    yield all([
      put(successAction),
      put(replace(`/colony/${colonyName}/task/${id}`)),
    ]);
  } catch (error) {
    return yield putError(ActionTypes.TASK_CREATE_ERROR, error, meta);
  }
  return null;
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* taskFetchAll() {
  const colonyAddresss = yield select(allColonyNamesSelector);
  yield all(
    colonyAddresss.map(colonyAddress =>
      call(fetchColonyTaskMetadata, colonyAddress),
    ),
  );
}

/*
 * As manager, finalize task (`completeTask` group)
 */
function* taskFinalize({
  payload: { colonyAddress, draftId },
  meta,
}: Action<ActionTypes.TASK_FINALIZE>) {
  try {
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const {
      data: { task },
    } = yield apolloClient.query<TaskQuery, TaskQueryVariables>({
      query: TaskDocument,
      variables: {
        id: draftId,
      },
    });

    const { assignedWorker, ethDomainId, ethSkillId } = task;

    // @todo get payouts from centralized store
    const payouts = [] as TaskPayoutType[];

    if (!assignedWorker)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!ethDomainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const { amount, token } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: {
        recipient: assignedWorker.id,
        token,
        amount: new BigNumber(amount.toString()),
        domainId: ethDomainId,
        skillId: ethSkillId || 0,
      },
    });

    // wait for tx to succeed
    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.mutate<
      FinalizeTaskMutation,
      FinalizeTaskMutationVariables
    >({
      mutation: FinalizeTaskDocument,
      variables: {
        input: {
          id: draftId,
        },
      },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_FINALIZE_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_FINALIZE_ERROR, error, meta);
  }
  return null;
}

function* taskSetWorkerOrPayouts({
  payload: { draftId, payouts, workerAddress },
  meta,
}: Action<ActionTypes.TASK_SET_WORKER_OR_PAYOUT>) {
  try {
    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const {
      data: {
        task: { assignedWorker, ethDomainId },
      },
    } = yield apolloClient.query<TaskQuery, TaskQueryVariables>({
      query: TaskDocument,
      variables: {
        id: draftId,
      },
    });

    if (workerAddress) {
      yield apolloClient.mutate<
        AssignWorkerMutation,
        AssignWorkerMutationVariables
      >({
        mutation: AssignWorkerDocument,
        variables: {
          input: {
            id: draftId,
            workerAddress,
          },
        },
      });
    } else {
      yield apolloClient.mutate<
        UnassignWorkerMutation,
        UnassignWorkerMutationVariables
      >({
        mutation: UnassignWorkerDocument,
        variables: {
          input: {
            id: draftId,
            workerAddress: assignedWorker.id,
          },
        },
      });
    }

    if (payouts && payouts.length) {
      yield apolloClient.mutate<
        SetTaskPayoutMutation,
        SetTaskPayoutMutationVariables
      >({
        mutation: SetTaskPayoutDocument,
        variables: {
          input: {
            id: draftId,
            amount: payouts[0].amount.toString(),
            tokenAddress: payouts[0].token,
          },
        },
      });
    } else {
      // @todo use payouts from centralized store
      const existingPayouts: TaskPayoutType[] = [];
      if (existingPayouts && existingPayouts.length) {
        yield apolloClient.mutate<
          RemoveTaskPayoutMutation,
          RemoveTaskPayoutMutationVariables
        >({
          mutation: RemoveTaskPayoutDocument,
          variables: {
            input: {
              id: draftId,
              amount: existingPayouts[0].amount.toString(),
              tokenAddress: existingPayouts[0].token,
            },
          },
        });
      }
    }

    yield put<AllActions>({
      type: ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.TASK_SET_WORKER_OR_PAYOUT_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* taskCommentAdd({
  payload: { author, comment, draftId },
  meta,
}: Action<ActionTypes.TASK_COMMENT_ADD>) {
  try {
    yield call(signMessage, 'taskComment', {
      comment,
      author,
    });

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    yield apolloClient.mutate<
      SendTaskMessageMutation,
      SendTaskMessageMutationVariables
    >({
      mutation: SendTaskMessageDocument,
      variables: {
        input: {
          id: draftId,
          message: comment,
        },
      },
      // @todo return `Task` from `SendTaskMessage` mutation to avoid needing to `refetchQueries`
      refetchQueries: [
        // fixme Is it possible to improve type safety here?
        { query: TaskFeedEventsDocument, variables: { id: draftId } },
      ],
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_COMMENT_ADD_SUCCESS,
    });
  } catch (error) {
    yield putError(ActionTypes.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
  yield takeEvery(
    ActionTypes.TASK_SET_WORKER_OR_PAYOUT,
    taskSetWorkerOrPayouts,
  );
  yield takeLeading(ActionTypes.TASK_FETCH_ALL, taskFetchAll);
}
