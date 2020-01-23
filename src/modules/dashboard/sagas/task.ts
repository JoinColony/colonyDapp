import ApolloClient from 'apollo-client';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import BigNumber from 'bn.js';
import moveDecimal from 'move-decimal-point';

import { Context, getContext } from '~context/index';
import {
  CreateTaskDocument,
  CreateTaskMutationResult,
  FinalizeTaskDocument,
  TaskDocument,
  CreateTaskMutation,
  CreateTaskMutationVariables,
  TaskQuery,
  TaskQueryVariables,
  FinalizeTaskMutation,
  FinalizeTaskMutationVariables,
  ColonyTasksDocument,
  ColonyTasksQueryVariables,
  ColonyTasksQuery,
} from '~data/index';
import { log } from '~utils/debug';
import { Action, ActionTypes } from '~redux/index';
import { ContractContexts } from '~types/index';
import { putError, takeFrom } from '~utils/saga/effects';

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
      update: (cache, { data: mutationData }) => {
        try {
          const cacheData = cache.readQuery<
            ColonyTasksQuery,
            ColonyTasksQueryVariables
          >({
            query: ColonyTasksDocument,
            variables: {
              address: colonyAddress,
            },
          });
          if (cacheData && mutationData && mutationData.createTask) {
            const tasks = cacheData.colony.tasks || [];
            tasks.push(mutationData.createTask);
            cache.writeQuery<ColonyTasksQuery, ColonyTasksQueryVariables>({
              query: ColonyTasksDocument,
              data: {
                colony: {
                  ...cacheData.colony,
                  tasks,
                },
              },
              variables: {
                address: colonyAddress,
              },
            });
          }
        } catch (e) {
          log.verbose(e);
          log.verbose('Not updating store - colony tasks not loaded yet');
        }
      },
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
      token: { address: token, decimals },
    } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: {
        recipient: assignedWorker.id,
        token,
        amount: new BigNumber(moveDecimal(amount, decimals)),
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

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
}
