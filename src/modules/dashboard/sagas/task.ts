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

import { Action, ActionTypes } from '~redux/index';
import { Address, ContractContexts } from '~types/index';
import { TaskType } from '~immutable/index';
import {
  executeCommand,
  executeQuery,
  putError,
  raceError,
  selectAsJS,
  executeSubscription,
  takeFrom,
} from '~utils/saga/effects';
import { generateUrlFriendlyId } from '~utils/data';

import { matchUsernames } from '~lib/TextDecorator';
import { usernameSelector, walletAddressSelector } from '../../users/selectors';
import { fetchColonyTaskMetadata as fetchColonyTaskMetadataAC } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  taskSelector,
} from '../selectors';
import { ROOT_DOMAIN } from '../../core/constants';
import { createTransaction, getTxChannel, signMessage } from '../../core/sagas';

import {
  assignWorker,
  cancelTask,
  closeTask,
  createTask,
  createWorkRequest,
  finalizeTask,
  postComment,
  sendWorkInvite,
  setTaskDescription,
  setTaskDomain,
  setTaskDueDate,
  setTaskPayout,
  removeTaskPayout,
  setTaskSkill,
  setTaskTitle,
  unassignWorker,
} from '../data/commands';
import {
  getTask,
  subscribeTaskFeedItems,
  subscribeTask,
} from '../data/queries';
import {
  createAssignedInboxEvent,
  createUnassignedInboxEvent,
  createCommentMention,
  createFinalizedInboxEvent,
  createWorkRequestInboxEvent,
} from '../../users/data/commands';

import { subscribeToTask } from '../../users/actionCreators';
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
  payload: { colonyAddress, domainId = ROOT_DOMAIN },
}: Action<ActionTypes.TASK_CREATE>) {
  try {
    const {
      record: { colonyName },
    } = yield select(colonySelector, colonyAddress);

    const creatorAddress = yield select(walletAddressSelector);

    // NOTE: This is going to be part of the store address so we need to be careful
    const draftId = generateUrlFriendlyId();
    const { taskStore, commentsStore, event } = yield executeCommand(
      createTask,
      {
        metadata: { colonyAddress, draftId, domainId },
        args: { creatorAddress, draftId, domainId },
      },
    );
    const successAction: Action<ActionTypes.TASK_CREATE_SUCCESS> = {
      type: ActionTypes.TASK_CREATE_SUCCESS,
      payload: {
        commentsStoreAddress: commentsStore.address.toString(),
        colonyAddress,
        draftId,
        event,
        taskStoreAddress: taskStore.address.toString(),
        task: {
          colonyAddress,
          creatorAddress,
          draftId,
          domainId,
        },
      },
      meta: { key: draftId, ...meta },
    };

    /*
     * Put the success action, subscribe to the task and redirect to it
     */
    yield all([
      put(successAction),
      put(subscribeToTask(colonyAddress, draftId)),
      put(replace(`/colony/${colonyName}/task/${draftId}`)),
    ]);
  } catch (error) {
    return yield putError(ActionTypes.TASK_CREATE_ERROR, error, meta);
  }
  return null;
}

/**
 * @todo Simplify the conversion of `getTask` query results to redux data.
 */
const getTaskFetchSuccessPayload = (
  { draftId, colonyAddress }: any,
  {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    amountPaid,
    commentsStoreAddress,
    finalizedAt,
    paymentId,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    invites,
    paymentTokenAddress = '',
    payout,
    requests,
    status: currentState,
    ...task
  }: any,
) => ({
  colonyAddress,
  draftId,
  task: {
    ...task,
    colonyAddress,
    currentState,
    draftId,
    invites,
    payouts: paymentTokenAddress
      ? [
          {
            amount: payout,
            token: paymentTokenAddress,
          },
        ]
      : undefined,
    requests,
  },
});

/*
 * Given a colony address and a task draft ID, fetch the task from its store.
 */
function* taskFetch({
  meta,
  payload: { colonyAddress, draftId },
}: Action<ActionTypes.TASK_FETCH>) {
  try {
    const taskData = yield executeQuery(getTask, {
      args: undefined,
      metadata: { colonyAddress, draftId },
    });
    yield put<AllActions>({
      type: ActionTypes.TASK_FETCH_SUCCESS,
      payload: getTaskFetchSuccessPayload({ draftId, colonyAddress }, taskData),
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_FETCH_ERROR, error, meta);
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

function* taskSetDescription({
  meta,
  payload: { colonyAddress, draftId, description },
}: Action<ActionTypes.TASK_SET_DESCRIPTION>) {
  try {
    const {
      record: { description: currentDescription },
    } = yield selectAsJS(taskSelector, draftId);
    const eventData = yield executeCommand(setTaskDescription, {
      args: {
        currentDescription,
        description,
      },
      metadata: { colonyAddress, draftId },
    });
    if (eventData) {
      const { event } = eventData;
      yield put<AllActions>({
        type: ActionTypes.TASK_SET_DESCRIPTION_SUCCESS,
        meta,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_DESCRIPTION_ERROR, error, meta);
  }
  return null;
}

function* taskSetTitle({
  meta,
  payload: { colonyAddress, draftId, title },
}: Action<ActionTypes.TASK_SET_TITLE>) {
  try {
    const {
      record: { title: currentTitle },
    }: { record: TaskType } = yield selectAsJS(taskSelector, draftId);
    const eventData = yield executeCommand(setTaskTitle, {
      args: { currentTitle, title },
      metadata: { colonyAddress, draftId },
    });
    if (eventData) {
      const { event } = eventData;
      yield put<AllActions>({
        type: ActionTypes.TASK_SET_TITLE_SUCCESS,
        meta,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_TITLE_ERROR, error, meta);
  }
  return null;
}

function* taskSetDomain({
  meta,
  payload: { colonyAddress, draftId, domainId },
}: Action<ActionTypes.TASK_SET_DOMAIN>) {
  try {
    const { event } = yield executeCommand(setTaskDomain, {
      args: { domainId },
      metadata: { colonyAddress, draftId },
    });
    yield put<AllActions>({
      type: ActionTypes.TASK_SET_DOMAIN_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_DOMAIN_ERROR, error, meta);
  }
  return null;
}

/*
 * Given a colony address and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskCancel({
  meta,
  payload: { colonyAddress, draftId },
}: Action<ActionTypes.TASK_CANCEL>) {
  try {
    const { event } = yield executeCommand(cancelTask, {
      args: { draftId },
      metadata: { colonyAddress, draftId },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_CANCEL_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_CANCEL_ERROR, error, meta);
  }
  return null;
}

/*
 * Given a colony address and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskClose({
  meta,
  payload: { colonyAddress, draftId },
}: Action<ActionTypes.TASK_CLOSE>) {
  try {
    const { event } = yield executeCommand(closeTask, {
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
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetSkill({
  payload: { colonyAddress, draftId, skillId },
  meta,
}: Action<ActionTypes.TASK_SET_SKILL>) {
  try {
    const { event } = yield executeCommand(setTaskSkill, {
      args: { skillId },
      metadata: { colonyAddress, draftId },
    });

    yield put<AllActions>({
      type: ActionTypes.TASK_SET_SKILL_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.TASK_SET_SKILL_ERROR, error, meta);
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
      record: { payouts },
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
        args: { token, amount },
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
  payload: { colonyAddress, draftId, dueDate },
  meta,
}: Action<ActionTypes.TASK_SET_DUE_DATE>) {
  try {
    const { event } = yield executeCommand(setTaskDueDate, {
      args: { dueDate: dueDate ? dueDate.getTime() : undefined },
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
    const walletAddress = yield select(walletAddressSelector);

    const {
      record: { workerAddress, payouts, domainId, skillId, title: taskTitle },
    }: { record: TaskType } = yield selectAsJS(taskSelector, draftId);
    if (!workerAddress)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!domainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const { amount, token } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);
    yield fork(createTransaction, meta.id, {
      context: ContractContexts.COLONY_CONTEXT,
      methodName: 'makePayment',
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
        paymentTokenAddress: token,
        amountPaid: amount.toString(),
        workerAddress,
        transactionHash: hash,
      },
      metadata: { colonyAddress, draftId },
    });

    // send a notification to the worker
    yield executeCommand(createFinalizedInboxEvent, {
      args: {
        colonyAddress,
        draftId,
        taskTitle: taskTitle || '',
        sourceUserAddress: walletAddress,
      },
      metadata: { workerAddress },
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
    const { workerAddress } = yield select(taskSelector, draftId);
    const { event } = yield executeCommand(sendWorkInvite, {
      args: { workerAddress },
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
    const walletAddress = yield select(walletAddressSelector);
    const { event } = yield executeCommand(createWorkRequest, {
      args: { workerAddress: walletAddress },
      metadata: { colonyAddress, draftId },
    });

    // send a notification to the manager
    const {
      record: { managerAddress, title: taskTitle },
    } = yield select(taskSelector, draftId);
    yield executeCommand(createWorkRequestInboxEvent, {
      args: {
        colonyAddress,
        draftId,
        taskTitle,
        sourceUserAddress: walletAddress,
      },
      metadata: { managerAddress },
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
    const walletAddress = yield select(walletAddressSelector);
    const {
      record: { workerAddress: currentWorkerAddress, title: taskTitle },
    } = yield select(taskSelector, draftId);
    const eventData = yield executeCommand(assignWorker, {
      args: { workerAddress, currentWorkerAddress },
      metadata: { colonyAddress, draftId },
    });
    if (eventData) {
      // send a notification to the worker
      yield executeCommand(createAssignedInboxEvent, {
        args: {
          colonyAddress,
          draftId,
          taskTitle,
          sourceUserAddress: walletAddress,
        },
        metadata: { workerAddress },
      });

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
      const userAddress = yield select(walletAddressSelector);
      const {
        record: { title: taskTitle },
      } = yield select(taskSelector, draftId);
      const eventData = yield executeCommand(unassignWorker, {
        args: { workerAddress, userAddress },
        metadata: { colonyAddress, draftId },
      });

      if (eventData) {
        // send a notification to the worker
        yield executeCommand(createUnassignedInboxEvent, {
          args: {
            colonyAddress,
            draftId,
            taskTitle,
            sourceUserAddress: userAddress,
          },
          metadata: { workerAddress },
        });

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
  payload: { author, colonyAddress, comment, draftId, taskTitle },
  meta,
}: Action<ActionTypes.TASK_COMMENT_ADD>) {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const currentUsername = yield select(usernameSelector, walletAddress);

    const signature = yield call(signMessage, 'taskComment', {
      comment,
      author,
    });

    const matches = (matchUsernames(comment) || []).filter(
      username => username !== currentUsername,
    );

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

    if (matches && matches.length) {
      yield executeCommand(createCommentMention, {
        args: {
          colonyAddress,
          draftId,
          taskTitle,
          comment,
          sourceUserAddress: walletAddress,
        },
        metadata: { matchingUsernames: matches },
      });
    }
  } catch (error) {
    yield putError(ActionTypes.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas() {
  yield takeEvery(ActionTypes.TASK_CANCEL, taskCancel);
  yield takeEvery(ActionTypes.TASK_CLOSE, taskClose);
  yield takeEvery(ActionTypes.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ActionTypes.TASK_CREATE, taskCreate);
  yield takeEvery(ActionTypes.TASK_FEED_ITEMS_SUB_START, taskFeedItemsSubStart);
  yield takeEvery(ActionTypes.TASK_FETCH, taskFetch);
  yield takeEvery(ActionTypes.TASK_FINALIZE, taskFinalize);
  yield takeEvery(ActionTypes.TASK_SEND_WORK_INVITE, taskSendWorkInvite);
  yield takeEvery(ActionTypes.TASK_SEND_WORK_REQUEST, taskSendWorkRequest);
  yield takeEvery(ActionTypes.TASK_SET_DESCRIPTION, taskSetDescription);
  yield takeEvery(ActionTypes.TASK_SET_DOMAIN, taskSetDomain);
  yield takeEvery(ActionTypes.TASK_SET_DUE_DATE, taskSetDueDate);
  yield takeEvery(ActionTypes.TASK_SET_PAYOUT, taskSetPayout);
  yield takeEvery(ActionTypes.TASK_REMOVE_PAYOUT, taskRemovePayout);
  yield takeEvery(ActionTypes.TASK_SET_SKILL, taskSetSkill);
  yield takeEvery(ActionTypes.TASK_SET_TITLE, taskSetTitle);
  yield takeEvery(ActionTypes.TASK_SUB_START, taskSubStart);
  yield takeEvery(
    ActionTypes.TASK_SET_WORKER_OR_PAYOUT,
    taskSetWorkerOrPayouts,
  );
  yield takeEvery(ActionTypes.TASK_WORKER_ASSIGN, taskWorkerAssign);
  yield takeEvery(ActionTypes.TASK_WORKER_UNASSIGN, taskWorkerUnassign);
  yield takeLeading(ActionTypes.TASK_FETCH_ALL, taskFetchAll);
}
