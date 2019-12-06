import ApolloClient from 'apollo-client';
import nanoid from 'nanoid';
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import BigNumber from 'bn.js';

import { Context, getContext } from '~context/index';
import { Action, ActionTypes } from '~redux/index';
import { Address, ContractContexts } from '~types/index';
import {
  executeCommand,
  putError,
  raceError,
  selectAsJS,
  executeSubscription,
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

import {
  assignWorker,
  closeTask,
  createWorkRequest,
  finalizeTask,
  postComment,
  sendWorkInvite,
  setTaskDueDate,
  setTaskPayout,
  removeTaskPayout,
  unassignWorker,
} from '../data/commands';
import {
  getTask,
  subscribeTaskFeedItems,
  subscribeTask,
} from '../data/queries';

import { AllActions } from '../../../redux/types/actions';
import { CREATE_TASK } from '../mutations';

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
      mutation: CREATE_TASK,
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
 * Given a colony address and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskClose({
  meta,
  payload: { colonyAddress, draftId, domainId },
}: Action<ActionTypes.TASK_CLOSE>) {
  try {
    const { event } = yield executeCommand(closeTask, {
      args: { domainId },
      metadata: { colonyAddress, draftId },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_CLOSE_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_CLOSE_ERROR, error, meta);
  }
  return null;
}

/*
 * As worker or manager, I want to be able to set a payout
 */

/*
 * @NOTE There's a case to be made here about simplifying the `taskSetPayout`
 * and `taskRemovePayout` sagas, by refactoring them into one, and deling
 * with the undefined values
 *
 * This will cut down on code, but make sure you handle all edge cases
 * especially when you deal with notification stores, where you don't have
 * a worker address to fetch them for
 */
function* taskSetPayout({
  payload: { colonyAddress, draftId, token, amount },
  meta,
}: Action<ActionTypes.TASK_SET_PAYOUT>) {
  try {
    const {
      record: { payouts, domainId },
    }: { record: TaskType } = yield selectAsJS(taskSelector, draftId);

    /*
     * Edge case, but prevent triggering this saga and subseqent event, if the
     * payment is the same as the previous one
     */
    if (
      !payouts ||
      !payouts.length ||
      !amount.eq(new BigNumber(payouts[0].amount))
    ) {
      const { event } = yield executeCommand(setTaskPayout, {
        args: { token, amount, domainId },
        metadata: { colonyAddress, draftId },
      });

      yield put<AllActions>({
        type: ActionTypes.TASK_SET_PAYOUT_SUCCESS,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_PAYOUT_ERROR, error, meta);
  }
  return null;
}

/*
 * As worker or manager, I want to be able to remove the payout
 */
function* taskRemovePayout({
  payload: { colonyAddress, draftId },
  meta,
}: Action<ActionTypes.TASK_REMOVE_PAYOUT>) {
  try {
    const {
      record: { payouts: currentPayouts },
    } = yield select(taskSelector, draftId);

    /*
     * Prevent triggering this saga and subseqent event,
     * if there isnt' a payment set
     */
    if (currentPayouts && currentPayouts.size) {
      const { event } = yield executeCommand(removeTaskPayout, {
        metadata: { colonyAddress, draftId },
      });

      yield put<AllActions>({
        type: ActionTypes.TASK_REMOVE_PAYOUT_SUCCESS,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_REMOVE_PAYOUT_ERROR, error, meta);
  }
  return null;
}

/*
 * As worker or manager, I want to be able to set a date
 */
function* taskSetDueDate({
  payload: { colonyAddress, draftId, dueDate, domainId },
  meta,
}: Action<ActionTypes.TASK_SET_DUE_DATE>) {
  try {
    const { event } = yield executeCommand(setTaskDueDate, {
      args: { dueDate: dueDate ? dueDate.getTime() : undefined, domainId },
      metadata: { colonyAddress, draftId },
    });
    yield put<AllActions>({
      type: ActionTypes.TASK_SET_DUE_DATE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_DUE_DATE_ERROR, error, meta);
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
    const {
      record: { workerAddress, payouts, domainId, skillId },
    }: { record: TaskType } = yield selectAsJS(taskSelector, draftId);
    if (!workerAddress)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!domainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const { amount, token } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'makePaymentFundedFromDomain',
      identifier: colonyAddress,
      params: {
        recipient: workerAddress,
        token,
        amount: new BigNumber(amount.toString()),
        domainId,
        skillId: skillId || 0,
      },
    });

    // wait for tx to succeed
    const {
      payload: {
        transaction: { hash },
      },
    } = yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    // add finalize task event to task store
    const { event } = yield executeCommand(finalizeTask, {
      args: {
        domainId,
        paymentTokenAddress: token,
        amountPaid: amount.toString(),
        workerAddress,
        transactionHash: hash,
      },
      metadata: { colonyAddress, draftId },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_FINALIZE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_FINALIZE_ERROR, error, meta);
  }
  return null;
}

function* taskSendWorkInvite({
  payload: { colonyAddress, draftId },
  meta,
}: Action<ActionTypes.TASK_SEND_WORK_INVITE>) {
  try {
    const { workerAddress, domainId } = yield select(taskSelector, draftId);
    const { event } = yield executeCommand(sendWorkInvite, {
      args: { workerAddress, domainId },
      metadata: { colonyAddress, draftId },
    });
    yield put<AllActions>({
      type: ActionTypes.TASK_SEND_WORK_INVITE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_SEND_WORK_INVITE_ERROR, error, meta);
  }
  return null;
}

function* taskSendWorkRequest({
  payload: { colonyAddress, draftId },
  meta,
}: Action<ActionTypes.TASK_SEND_WORK_REQUEST>) {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const { event } = yield executeCommand(createWorkRequest, {
      args: { workerAddress: walletAddress },
      metadata: { colonyAddress, draftId },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_SEND_WORK_REQUEST_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.TASK_SEND_WORK_REQUEST_ERROR,
      error,
      meta,
    );
  }
  return null;
}

/*
 * @NOTE There's a case to be made here about simplifying the `taskWorkerAssign`
 * and `taskWorkerUnassign` sagas, by refactoring them into one, and deling
 * with the undefined values
 *
 * This will cut down on code, but make sure you handle all edge cases
 * especially when you deal with notification stores, where you don't have
 * a worker address to fetch them for
 */
function* taskWorkerAssign({
  payload: { colonyAddress, draftId, workerAddress },
  meta,
}: Action<ActionTypes.TASK_WORKER_ASSIGN>) {
  try {
    const {
      record: { workerAddress: currentWorkerAddress, domainId },
    } = yield select(taskSelector, draftId);
    const eventData = yield executeCommand(assignWorker, {
      args: { workerAddress, currentWorkerAddress, domainId },
      metadata: { colonyAddress, draftId },
    });
    if (eventData) {
      const { event } = eventData;
      yield put<AllActions>({
        type: ActionTypes.TASK_WORKER_ASSIGN_SUCCESS,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_WORKER_ASSIGN_ERROR, error, meta);
  }
  return null;
}

function* taskWorkerUnassign({
  payload: { colonyAddress, draftId, workerAddress },
  meta,
}: Action<ActionTypes.TASK_WORKER_UNASSIGN>) {
  try {
    /*
     * Edge case, but prevent triggering this saga and subseqent event, if there
     * isnt' a user already assigned
     */
    if (workerAddress) {
      const { walletAddress } = yield getLoggedInUser();
      const {
        record: { domainId },
      } = yield select(taskSelector, draftId);
      const eventData = yield executeCommand(unassignWorker, {
        args: { workerAddress, userAddress: walletAddress, domainId },
        metadata: { colonyAddress, draftId },
      });

      if (eventData) {
        const { event } = eventData;
        yield put<AllActions>({
          type: ActionTypes.TASK_WORKER_UNASSIGN_SUCCESS,
          payload: {
            colonyAddress,
            draftId,
            event,
          },
          meta,
        });
      }
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_WORKER_UNASSIGN_ERROR, error, meta);
  }
  return null;
}

function* taskSetWorkerOrPayouts({
  payload: { colonyAddress, draftId, payouts, workerAddress },
  meta,
}: Action<ActionTypes.TASK_SET_WORKER_OR_PAYOUT>) {
  try {
    const payload = { colonyAddress, draftId };
    const {
      record: { workerAddress: currentWorkerAddress },
    } = yield select(taskSelector, draftId);
    if (workerAddress) {
      yield call(taskWorkerAssign, {
        meta: { key: draftId },
        payload: { ...payload, workerAddress },
        type: ActionTypes.TASK_WORKER_ASSIGN,
      });
    } else {
      yield call(taskWorkerUnassign, {
        meta: { key: draftId },
        payload: { ...payload, workerAddress: currentWorkerAddress },
        type: ActionTypes.TASK_WORKER_UNASSIGN,
      });
    }

    if (payouts && payouts.length) {
      yield call(taskSetPayout, {
        meta,
        payload: { ...payload, ...payouts[0] },
        type: ActionTypes.TASK_SET_PAYOUT,
      });
    } else {
      /*
       * Last payout, remove it whole
       */
      yield call(taskRemovePayout, {
        meta,
        payload,
        type: ActionTypes.TASK_REMOVE_PAYOUT,
      });
    }

    yield put<AllActions>({
      type: ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS,
      meta,
      payload: {
        ...payload,
        payouts,
        workerAddress,
      },
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

function* taskFeedItemsSubStart({
  payload: { colonyAddress, draftId },
  meta,
}: any) {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeTaskFeedItems, {
      metadata: { colonyAddress, draftId },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.TASK_FEED_ITEMS_SUB_STOP &&
          action.payload.draftId === draftId,
      );
      channel.close();
    });

    while (true) {
      const events = yield take(channel);
      yield put({
        type: ActionTypes.TASK_FEED_ITEMS_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          draftId,
          events,
        },
      });
    }
  } catch (caughtError) {
    return yield putError(
      ActionTypes.TASK_FEED_ITEMS_SUB_ERROR,
      caughtError,
      meta,
    );
  } finally {
    if (channel && typeof channel.close === 'function') {
      channel.close();
    }
  }
}

function* taskSubStart({ payload: { colonyAddress, draftId }, meta }: any) {
  // This could be generalised (it's very similar to the above function),
  // but it's probably worth waiting to see, as this pattern will likely change
  // as it gets used elsewhere.
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeTask, {
      metadata: { colonyAddress, draftId },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.TASK_SUB_STOP &&
          action.payload.draftId === draftId,
      );
      channel.close();
    });

    while (true) {
      const events = yield take(channel);
      yield put({
        type: ActionTypes.TASK_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          draftId,
          events,
        },
      });
    }
  } catch (caughtError) {
    return yield putError(ActionTypes.TASK_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close === 'function') {
      channel.close();
    }
  }
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

    const { event } = yield executeCommand(postComment, {
      args: {
        signature,
        content: {
          id: nanoid(),
          author: walletAddress,
          body: comment,
        },
      },
      metadata: {
        colonyAddress,
        draftId,
      },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_COMMENT_ADD_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ActionTypes.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_CLOSE, taskClose);
  yield takeEvery(ActionTypes.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FEED_ITEMS_SUB_START, taskFeedItemsSubStart);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
  yield takeEvery(ActionTypes.TASK_SEND_WORK_INVITE, taskSendWorkInvite);
  yield takeEvery(ActionTypes.TASK_SEND_WORK_REQUEST, taskSendWorkRequest);
  yield takeEvery(ActionTypes.TASK_SET_DUE_DATE, taskSetDueDate);
  yield takeEvery(ActionTypes.TASK_SET_PAYOUT, taskSetPayout);
  yield takeEvery(ActionTypes.TASK_REMOVE_PAYOUT, taskRemovePayout);
  yield takeEvery(ActionTypes.TASK_SUB_START, taskSubStart);
  yield takeEvery(
    ActionTypes.TASK_SET_WORKER_OR_PAYOUT,
    taskSetWorkerOrPayouts,
  );
  yield takeEvery(ActionTypes.TASK_WORKER_ASSIGN, taskWorkerAssign);
  yield takeEvery(ActionTypes.TASK_WORKER_UNASSIGN, taskWorkerUnassign);
  yield takeLeading(ActionTypes.TASK_FETCH_ALL, taskFetchAll);
}
