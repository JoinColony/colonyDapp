import ApolloClient from 'apollo-client';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import BigNumber from 'bn.js';

import { Context, getContext } from '~context/index';
import {
  CreateTaskDocument,
  CreateTaskMutationResult,
  FinalizeTaskDocument,
  TaskDocument,
  SendTaskMessageDocument,
  SendTaskMessageMutation,
  SendTaskMessageMutationVariables,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  TaskQuery,
  TaskQueryVariables,
  FinalizeTaskMutation,
  FinalizeTaskMutationVariables,
  TaskFeedEventsDocument,
  ColonyTasksDocument,
  TaskFeedEventsQueryVariables,
  ColonyTasksQueryVariables,
} from '~data/index';
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
        {
          query: ColonyTasksDocument,
          variables: { address: colonyAddress } as ColonyTasksQueryVariables,
        },
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

    const { assignedWorker, ethDomainId, ethSkillId, payouts } = task;

    if (!assignedWorker)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!ethDomainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const {
      amount,
      token: { address: token },
    } = payouts[0];

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

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_RECEIPT_RECEIVED);

    const {
      payload: {
        eventData: { potId },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.mutate<
      FinalizeTaskMutation,
      FinalizeTaskMutationVariables
    >({
      mutation: FinalizeTaskDocument,
      variables: {
        input: {
          id: draftId,
          ethPotId: potId,
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
        {
          query: TaskFeedEventsDocument,
          variables: { id: draftId } as TaskFeedEventsQueryVariables,
        },
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
}
