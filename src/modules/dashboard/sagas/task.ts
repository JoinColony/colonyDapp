import ApolloClient from 'apollo-client';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import BigNumber from 'bn.js';

import { Context, getContext } from '~context/index';
import {
  AssignWorkerDocument,
  CreateTaskDocument,
  CreateTaskMutationResult,
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
import { ContractContexts } from '~types/index';
import { putError, takeFrom } from '~utils/saga/effects';

import { createTransaction, getTxChannel, signMessage } from '../../core/sagas';

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
      // @TODO mutate state directly instead of refetching queries
      // @BODY See https://github.com/JoinColony/colonyDapp/pull/1933/files#r359016028
      refetchQueries: [
        { query: ColonyTasksDocument, variables: { address: colonyAddress } },
      ],
    });

    if (!data || !data.createTask) throw new Error('Could not create task');

    const {
      id,
      colony: { colonyName },
    } = data.createTask;

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

// FIXME I think we can just do this in the component (no saga needed)
// Also remove the actions
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
        task: { assignedWorker },
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
}
