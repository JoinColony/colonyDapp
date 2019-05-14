/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLeading,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';
import nanoid from 'nanoid';
import type { Action } from '~redux';
import type { Address } from '~types';

import { CONTEXT, getContext } from '~context';
import {
  executeCommand,
  executeQuery,
  putError,
  raceError,
  putNotification,
} from '~utils/saga/effects';
import { generateUrlFriendlyId } from '~utils/data';
import { ACTIONS } from '~redux';

import { fetchColonyTaskMetadata as createColonyTaskMetadataFetchAction } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  taskSelector,
} from '../selectors';
import {
  currentUserMetadataSelector,
  walletAddressSelector,
} from '../../users/selectors';

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
import { commentMentionNotification } from '../../users/data/commands';
import { getTask, getTaskFeedItems } from '../data/queries';

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
    const wallet = yield* getContext(CONTEXT.WALLET);
    // NOTE: This is going to be part of the store address so we need to be careful
    const draftId = generateUrlFriendlyId();
    const creatorAddress = wallet.address;
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
 * As worker or manager, I want to be able to set a skill
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
 * As anyone, finalize task (`completeTask` group)
 */
function* taskFinalize({
  payload: { colonyAddress, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const { workerAddress, amountPaid } = yield select(taskSelector, draftId);
    const { event } = yield* executeCommand(finalizeTask, {
      /**
       * @todo Set the payment ID/payment token address when finalising a task
       */
      args: { amountPaid, workerAddress },
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
    const { event } = yield* executeCommand(assignWorker, {
      args: { workerAddress },
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
      payload: {
        colonyAddress,
        draftId,
        event,
      },
      meta,
    });
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

function* taskFeedItemsFetch({
  payload: { colonyAddress, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH>): Saga<void> {
  try {
    const events = yield* executeQuery(getTaskFeedItems, {
      metadata: { colonyAddress, draftId },
    });
    yield put<Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        draftId,
        events,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FEED_ITEMS_FETCH_ERROR, error, meta);
  }
}

function* taskCommentAdd({
  payload: { colonyAddress, draftId, commentData, taskTitle },
  meta,
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    const { inboxStoreAddress } = yield select(currentUserMetadataSelector);
    const walletAddress = yield select(walletAddressSelector);
    const wallet = yield* getContext(CONTEXT.WALLET);
    /*
     * @todo Wire message signing to the Gas Station, once it's available
     */
    const signature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    const { event } = yield* executeCommand(postComment, {
      args: {
        signature,
        content: {
          id: nanoid(),
          author: wallet.address,
          ...commentData,
        },
      },
      metadata: { colonyAddress, draftId },
    });

    /*
     * @todo Filter out mentioned users.
     * @body We need to filter out mentioned users from `commentData`.
     * In the old beta we used to use `linkify-it` to achieve that
     *
     * See: https://github.com/JoinColony/colonyDapp/issues/1011 for the
     * implementation details regarding this
     *
     * Also, this should be iterated through each mentioned user, and add
     * a notification event to each one's store
     */
    yield* executeCommand(commentMentionNotification, {
      args: {
        colonyAddress,
        event: 'notificationUserMentioned',
        taskTitle,
        comment: commentData.body,
      },
      metadata: { walletAddress: wallet.address, inboxStoreAddress },
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

    /*
     * @NOTE This is assuming we have a notification for the current user
     * So this should actually be gated behind a conditional
     * (once the mentions are all wired up)
     */
    yield putNotification({
      comment: commentData.body,
      event: 'notificationUserMentioned',
      sourceUserAddress: walletAddress,
      taskTitle,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_CANCEL, taskCancel);
  yield takeEvery(ACTIONS.TASK_CLOSE, taskClose);
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreate);
  yield takeEvery(ACTIONS.TASK_FEED_ITEMS_FETCH, taskFeedItemsFetch);
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
  yield takeEvery(ACTIONS.TASK_WORKER_ASSIGN, taskWorkerAssign);
  yield takeEvery(ACTIONS.TASK_WORKER_UNASSIGN, taskWorkerUnassign);
  yield takeLeading(ACTIONS.TASK_FETCH_ALL, taskFetchAll);
}
