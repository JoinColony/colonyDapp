/* @flow */

import type { Saga } from 'redux-saga';
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

import type { Action } from '~redux';
import type { Address } from '~types';
import type { TaskType } from '~immutable';
import { CONTEXT, getContext } from '~context';
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
import { ACTIONS } from '~redux';
import { matchUsernames } from '~lib/TextDecorator';
import {
  usernameSelector,
  walletAddressSelector,
  userAddressByMultipleUsernameSelector,
} from '../../users/selectors';
import { fetchColonyTaskMetadata as createColonyTaskMetadataFetchAction } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  taskSelector,
} from '../selectors';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

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
  setTaskSkill,
  setTaskTitle,
  unassignWorker,
} from '../data/commands';
import {
  getTask,
  subscribeTaskFeedItems,
  subscribeTask,
} from '../data/queries';
import { createCommentMention } from '../../users/data/commands';

import { subscribeToTask } from '../../users/actionCreators';

/*
 * Dispatch an action to fetch the colony task metadata and wait for the
 * success/error action.
 */
export function* fetchColonyTaskMetadata(colonyAddress: Address): Saga<*> {
  const metadata = yield select(colonyTaskMetadataSelector, colonyAddress);

  /*
   * Dispatch an action to fetch the task metadata for this colony
   * (if necessary).
   */
  if (metadata == null || metadata.error || !metadata.isFetching) {
    yield put(createColonyTaskMetadataFetchAction(colonyAddress));

    /*
     * Wait for any success/error action of this type; this may not be from
     * the action dispatched above, because it could have been from a previously
     * dispatched action that did not block the UI.
     */
    return yield raceError(
      ({ type, payload }) =>
        type === ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS &&
        payload.colonyAddress === colonyAddress,
      ({ type, payload }) =>
        type === ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR &&
        payload.colonyAddress === colonyAddress,
    );
  }

  return null;
}

function* taskCreate({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.TASK_CREATE>): Saga<void> {
  try {
    const {
      record: { colonyName },
    } = yield select(colonySelector, colonyAddress);

    const creatorAddress = yield select(walletAddressSelector);

    // NOTE: This is going to be part of the store address so we need to be careful
    const draftId = generateUrlFriendlyId();
    const { taskStore, commentsStore, event } = yield* executeCommand(
      createTask,
      {
        metadata: { colonyAddress, draftId },
        args: { creatorAddress, draftId },
      },
    );
    const successAction: Action<typeof ACTIONS.TASK_CREATE_SUCCESS> = {
      type: ACTIONS.TASK_CREATE_SUCCESS,
      payload: {
        commentsStoreAddress: commentsStore.address.toString(),
        colonyAddress,
        draftId,
        event,
        taskStoreAddress: taskStore.address.toString(),
        task: {
          colonyAddress,
          draftId,
          creatorAddress,
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
    yield putError(ACTIONS.TASK_CREATE_ERROR, error, meta);
  }
}

/**
 * @todo Simplify the conversion of `getTask` query results to redux data.
 */
const getTaskFetchSuccessPayload = (
  { draftId, colonyAddress }: *,
  {
    amountPaid,
    commentsStoreAddress,
    finalizedAt,
    invites,
    paymentId,
    paymentTokenAddress = '',
    payout,
    requests,
    status: currentState,
    ...task
  }: *,
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
            // Consider using strings for amounts in TaskPayout
            amount: parseInt(payout, 10),
            // We should get the token name, or even alter TaskType so that we use
            // token addresses and amounts only (not name or symbol)
            token: {
              address: paymentTokenAddress,
              name: 'Token',
              symbol: 'TKN',
            },
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
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const taskData = yield* executeQuery(getTask, {
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_SUCCESS,
      payload: getTaskFetchSuccessPayload({ draftId, colonyAddress }, taskData),
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_ERROR, error, meta);
  }
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* taskFetchAll(): Saga<void> {
  const colonyAddresss = yield select(allColonyNamesSelector);
  yield all(
    colonyAddresss.map(colonyAddress =>
      put(fetchColonyTaskMetadata(colonyAddress)),
    ),
  );
}

function* taskSetDescription({
  meta,
  payload: { colonyAddress, draftId, description },
}: Action<typeof ACTIONS.TASK_SET_DESCRIPTION>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskDescription, {
      args: {
        description,
      },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DESCRIPTION_SUCCESS>>({
      type: ACTIONS.TASK_SET_DESCRIPTION_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DESCRIPTION_ERROR, error, meta);
  }
}

function* taskSetTitle({
  meta,
  payload: { colonyAddress, draftId, title },
}: Action<typeof ACTIONS.TASK_SET_TITLE>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskTitle, {
      args: { title },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SET_TITLE_SUCCESS>>({
      type: ACTIONS.TASK_SET_TITLE_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_TITLE_ERROR, error, meta);
  }
}

function* taskSetDomain({
  meta,
  payload: { colonyAddress, draftId, domainId },
}: Action<typeof ACTIONS.TASK_SET_DOMAIN>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskDomain, {
      args: { domainId },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DOMAIN_SUCCESS>>({
      type: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DOMAIN_ERROR, error, meta);
  }
}

/*
 * Given a colony address and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskCancel({
  meta,
  payload: { colonyAddress, draftId },
}: Action<typeof ACTIONS.TASK_CANCEL>): Saga<void> {
  try {
    const { event } = yield* executeCommand(cancelTask, {
      args: { draftId },
      metadata: { colonyAddress, draftId },
    });

    yield put<Action<typeof ACTIONS.TASK_CANCEL_SUCCESS>>({
      type: ACTIONS.TASK_CANCEL_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CANCEL_ERROR, error, meta);
  }
}

/*
 * Given a colony address and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskClose({
  meta,
  payload: { colonyAddress, draftId },
}: Action<typeof ACTIONS.TASK_CLOSE>): Saga<void> {
  try {
    const { event } = yield* executeCommand(closeTask, {
      metadata: { colonyAddress, draftId },
    });

    yield put<Action<typeof ACTIONS.TASK_CLOSE_SUCCESS>>({
      type: ACTIONS.TASK_CLOSE_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CLOSE_ERROR, error, meta);
  }
}

/*
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetSkill({
  payload: { colonyAddress, draftId, skillId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskSkill, {
      args: { skillId },
      metadata: { colonyAddress, draftId },
    });

    yield put<Action<typeof ACTIONS.TASK_SET_SKILL_SUCCESS>>({
      type: ACTIONS.TASK_SET_SKILL_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_SKILL_ERROR, error, meta);
  }
}

/*
 * As worker or manager, I want to be able to set a payout
 */
function* taskSetPayout({
  payload: { colonyAddress, draftId, token, amount },
  meta,
}: Action<typeof ACTIONS.TASK_SET_PAYOUT>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskPayout, {
      args: { token, amount },
      metadata: { colonyAddress, draftId },
    });

    yield put<Action<typeof ACTIONS.TASK_SET_PAYOUT_SUCCESS>>({
      type: ACTIONS.TASK_SET_PAYOUT_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_PAYOUT_ERROR, error, meta);
  }
}

/*
 * As worker or manager, I want to be able to set a date
 */
function* taskSetDueDate({
  payload: { colonyAddress, draftId, dueDate },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DUE_DATE>): Saga<void> {
  try {
    const { event } = yield* executeCommand(setTaskDueDate, {
      args: { dueDate: dueDate.getTime() },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DUE_DATE_SUCCESS>>({
      type: ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DUE_DATE_ERROR, error, meta);
  }
}

/*
 * As manager, finalize task (`completeTask` group)
 */
function* taskFinalize({
  payload: { colonyAddress, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const {
      record: { workerAddress, payouts, domainId, skillId },
    }: { record: TaskType } = yield* selectAsJS(taskSelector, draftId);
    if (!workerAddress)
      throw new Error(`Worker not assigned for task ${draftId}`);
    if (!domainId) throw new Error(`Domain not set for task ${draftId}`);
    if (!skillId) throw new Error(`Skill not set for task ${draftId}`);
    if (!payouts.length) throw new Error(`No payout set for task ${draftId}`);
    const { amount, token } = payouts[0];

    const txChannel = yield call(getTxChannel, meta.id);

    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'makePayment',
      identifier: colonyAddress,
      params: {
        recipient: workerAddress,
        token: token.address,
        amount: new BigNumber(amount.toString()),
        domainId,
        skillId,
      },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    const { address: paymentTokenAddress } = token;
    const { event } = yield* executeCommand(finalizeTask, {
      args: {
        paymentTokenAddress,
        amountPaid: amount.toString(),
        workerAddress,
      },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_FINALIZE_SUCCESS>>({
      type: ACTIONS.TASK_FINALIZE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FINALIZE_ERROR, error, meta);
  }
}

function* taskSendWorkInvite({
  payload: { colonyAddress, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_INVITE>): Saga<void> {
  try {
    const { workerAddress } = yield select(taskSelector, draftId);
    const { event } = yield* executeCommand(sendWorkInvite, {
      args: { workerAddress },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_INVITE_ERROR, error, meta);
  }
}

function* taskSendWorkRequest({
  payload: { colonyAddress, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST>): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { event } = yield* executeCommand(createWorkRequest, {
      args: { workerAddress: walletAddress },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_REQUEST_ERROR, error, meta);
  }
}

function* taskWorkerAssign({
  payload: { colonyAddress, draftId, workerAddress },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_ASSIGN>): Saga<void> {
  try {
    const {
      record: { workerAddress: currentWorkerAddress },
    } = yield select(taskSelector, draftId);
    const eventData = yield* executeCommand(assignWorker, {
      args: { workerAddress, currentWorkerAddress },
      metadata: { colonyAddress, draftId },
    });
    if (eventData) {
      const { event } = eventData;
      yield put<Action<typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS>>({
        type: ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
        meta,
      });
    }
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_ASSIGN_ERROR, error, meta);
  }
}

function* taskWorkerUnassign({
  payload: { colonyAddress, draftId, workerAddress },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_UNASSIGN>): Saga<void> {
  try {
    const { event } = yield* executeCommand(unassignWorker, {
      args: { workerAddress },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_UNASSIGN_ERROR, error, meta);
  }
}

function* taskSetWorkerAndPayouts({
  payload: { colonyAddress, draftId, payouts, workerAddress },
  meta,
}: Action<typeof ACTIONS.TASK_SET_WORKER_AND_PAYOUTS>): Saga<void> {
  try {
    yield call(taskWorkerAssign, {
      meta: { key: draftId },
      payload: { colonyAddress, draftId, workerAddress },
      type: ACTIONS.TASK_WORKER_ASSIGN,
    });

    const {
      record: { payouts: existingPayouts },
    } = yield select(taskSelector, draftId);
    if (payouts && !(existingPayouts && existingPayouts.length > 0)) {
      yield all(
        payouts.map(({ amount, token }) =>
          call(taskSetPayout, {
            meta,
            payload: {
              colonyAddress,
              draftId,
              amount,
              token,
            },
            type: ACTIONS.TASK_SET_PAYOUT,
          }),
        ),
      );
    }

    yield put<Action<typeof ACTIONS.TASK_SET_WORKER_AND_PAYOUTS_SUCCESS>>({
      type: ACTIONS.TASK_SET_WORKER_AND_PAYOUTS_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        payouts,
        workerAddress,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_WORKER_AND_PAYOUTS_ERROR, error, meta);
  }
}

function* taskFeedItemsSubStart({
  payload: { colonyAddress, draftId },
  meta,
}: *): Saga<void> {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeTaskFeedItems, {
      metadata: { colonyAddress, draftId },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ACTIONS.TASK_FEED_ITEMS_SUB_STOP &&
          action.payload.draftId === draftId,
      );
      channel.close();
    });

    while (true) {
      const event = yield take(channel);
      yield put({
        type: ACTIONS.TASK_FEED_ITEMS_SUB_EVENT,
        meta,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
      });
    }
  } catch (caughtError) {
    yield putError(ACTIONS.TASK_FEED_ITEMS_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

function* taskSubStart({
  payload: { colonyAddress, draftId },
  meta,
}: *): Saga<void> {
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
          action.type === ACTIONS.TASK_SUB_STOP &&
          action.payload.draftId === draftId,
      );
      channel.close();
    });

    while (true) {
      const event = yield take(channel);
      yield put({
        type: ACTIONS.TASK_SUB_EVENT,
        meta,
        payload: {
          colonyAddress,
          draftId,
          event,
        },
      });
    }
  } catch (caughtError) {
    yield putError(ACTIONS.TASK_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

function* taskCommentAdd({
  payload: { author, colonyAddress, comment, draftId, taskTitle },
  meta,
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const currentUsername = yield select(usernameSelector, walletAddress);
    const wallet = yield* getContext(CONTEXT.WALLET);

    /*
     * @NOTE Initiate the message signing process
     */
    const messageId = `${nanoid(10)}-signMessage`;
    const message = JSON.stringify({ comment, author });
    yield put<Action<typeof ACTIONS.MESSAGE_CREATED>>({
      type: ACTIONS.MESSAGE_CREATED,
      payload: {
        id: messageId,
        purpose: 'taskComment',
        message,
        createdAt: new Date(),
      },
    });

    /*
     * @NOTE Wait (block) until there's a matching action
     */
    yield take(
      ({ type, payload }) =>
        type === ACTIONS.MESSAGE_SIGN && payload.id === messageId,
    );

    const signature = yield call([wallet, wallet.signMessage], {
      message,
    });

    yield put<Action<typeof ACTIONS.MESSAGE_SIGNED>>({
      type: 'MESSAGE_SIGNED',
      payload: { id: messageId, signature },
    });

    const matches = (matchUsernames(comment) || []).filter(
      username => username !== currentUsername,
    );

    const { event } = yield* executeCommand(postComment, {
      args: {
        signature,
        content: {
          id: nanoid(),
          author: wallet.address,
          body: comment,
        },
      },
      metadata: {
        colonyAddress,
        draftId,
      },
    });

    yield put<Action<typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS>>({
      type: ACTIONS.TASK_COMMENT_ADD_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });

    if (matches && matches.length) {
      const cachedAddresses = yield select(
        userAddressByMultipleUsernameSelector,
        matches,
      );
      yield* executeCommand(createCommentMention, {
        args: {
          colonyAddress,
          draftId,
          taskTitle,
          comment,
          sourceUsername: currentUsername,
          sourceUserWalletAddress: walletAddress,
        },
        metadata: { matchingUsernames: matches, cachedAddresses },
      });
    }
  } catch (error) {
    yield putError(ACTIONS.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_CANCEL, taskCancel);
  yield takeEvery(ACTIONS.TASK_CLOSE, taskClose);
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreate);
  yield takeEvery(ACTIONS.TASK_FEED_ITEMS_SUB_START, taskFeedItemsSubStart);
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetch);
  yield takeEvery(ACTIONS.TASK_FINALIZE, taskFinalize);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_INVITE, taskSendWorkInvite);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_REQUEST, taskSendWorkRequest);
  yield takeEvery(ACTIONS.TASK_SET_DESCRIPTION, taskSetDescription);
  yield takeEvery(ACTIONS.TASK_SET_DOMAIN, taskSetDomain);
  yield takeEvery(ACTIONS.TASK_SET_DUE_DATE, taskSetDueDate);
  yield takeEvery(ACTIONS.TASK_SET_PAYOUT, taskSetPayout);
  yield takeEvery(ACTIONS.TASK_SET_SKILL, taskSetSkill);
  yield takeEvery(ACTIONS.TASK_SET_TITLE, taskSetTitle);
  yield takeEvery(ACTIONS.TASK_SUB_START, taskSubStart);
  yield takeEvery(ACTIONS.TASK_SET_WORKER_AND_PAYOUTS, taskSetWorkerAndPayouts);
  yield takeEvery(ACTIONS.TASK_WORKER_ASSIGN, taskWorkerAssign);
  yield takeEvery(ACTIONS.TASK_WORKER_UNASSIGN, taskWorkerUnassign);
  yield takeLeading(ACTIONS.TASK_FETCH_ALL, taskFetchAll);
}
