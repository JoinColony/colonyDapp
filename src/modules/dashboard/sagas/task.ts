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
} from '~data/index';
import { Action, ActionTypes } from '~redux/index';
import { Address, ContractContexts } from '~types/index';
import {
  executeCommand,
  putError,
  raceError,
  takeFrom,
} from '~utils/saga/effects';
import { generateUrlFriendlyId } from '~utils/strings';
import { getLoggedInUser } from '~data/index';

import { fetchColonyTaskMetadata as fetchColonyTaskMetadataAC } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonySelector,
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
  payload: { colonyAddress, ethDomainId },
}: Action<ActionTypes.TASK_CREATE>) {
  try {
    const {
      record: { colonyName },
    } = yield select(colonySelector, colonyAddress);

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const {
      data: { createTask },
    } = yield apolloClient.mutate({
      mutation: CreateTaskDocument,
      variables: {
        input: {
          colonyAddress,
          ethDomainId,
        },
      },
    });

    // Not sure what to use for task slug - `id` or `ethTaskId`. Will these be the same?
    const { id } = createTask;

    const successAction: Action<ActionTypes.TASK_CREATE_SUCCESS> = {
      type: ActionTypes.TASK_CREATE_SUCCESS,
      payload: {
        id,
        colonyAddress,
        task: {
          id,
          ethDomainId,
        },
      },
      meta: { key: id, ...meta },
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
    const { walletAddress } = yield getLoggedInUser();

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data: { task } } = yield apolloClient.query({
      query: TaskDocument,
      variables: {
        id: draftId,
      },
    });

    const { assignedWorker, ethDomainId, ethSkillId, title } = task;

    // @todo get payouts from centralized store
    const payouts = [];

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
    const {
      payload: {
        transaction: { hash },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield apolloClient.mutate({
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

    const { data: { task: { assignedWorker, ethDomainId } } } = yield apolloClient.query({
      query: TaskDocument,
      variables: {
        id: draftId,
      },
    });

    if (workerAddress) {
      yield apolloClient.mutate({
        mutation: AssignWorkerDocument,
        variables: {
          input: {
            id: draftId,
            workerAddress,
          },
        },
      });
    } else {
      yield apolloClient.mutate({
        mutation: UnassignWorkerDocument,
        variables: {
          input: {
            id: draftId,
            workerAddress: assignedWorker.id,
          },
        },
      });
    };

    if (payouts && payouts.length) {
      yield apolloClient.mutate({
        mutation: SetTaskPayoutDocument,
        variables: {
          input: {
            id: draftId,
            ethDomainId,
            ...payouts[0],
          },
        },
      });
    } else {
      // @todo use payouts from centralized store
      const existingPayouts: any[] = [];
      if (existingPayouts && existingPayouts.length) {
        yield apolloClient.mutate({
          mutation: RemoveTaskPayoutDocument,
          variables: {
            input: {
              id: draftId,
              ethDomainId,
              ...existingPayouts[0],
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
  payload: { author, colonyAddress, comment, draftId },
  meta,
}: Action<ActionTypes.TASK_COMMENT_ADD>) {
  try {
    const { walletAddress } = yield getLoggedInUser();

    const signature = yield call(signMessage, 'taskComment', {
      comment,
      author,
    });

    const matches = (matchUsernames(comment) || []).filter(
      username => username !== currentUsername,
    );

    const apolloClient: ApolloClient<any> = yield getContext(
      Context.APOLLO_CLIENT
    );

    yield apolloClient.mutate({
      mutation: SendTaskMessageDocument,
      variables: {
        input: {
          id: draftId,
          message: comment,
        },
      },
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
