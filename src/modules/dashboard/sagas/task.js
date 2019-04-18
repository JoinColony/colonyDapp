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
import nanoid from 'nanoid';
import { replace } from 'connected-react-router';

import type { Action } from '~redux';
import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';

import { CONTEXT, getContext } from '~context';
import {
  executeCommand,
  executeQuery,
  putError,
  raceError,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { fetchColonyTaskMetadata as createColonyTaskMetadataFetchAction } from '../actionCreators';
import {
  allColonyNamesSelector,
  colonySelector,
  colonyTaskMetadataSelector,
  taskMetadataSelector,
  taskSelector,
} from '../selectors';
import {
  currentUserMetadataSelector,
  walletAddressSelector,
} from '../../users/selectors';
import { getColonyContext } from './shared';

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
  if (metadata == null || metadata.error || !metadata.isFetching)
    yield put(createColonyTaskMetadataFetchAction(colonyAddress));

  /*
   * Wait for any success/error action of this type; this may not be from
   * the action dispatched above, because it could have been from a previously
   * dispatched action that did not block the UI.
   */
  yield raceError(
    ({ type, payload }) =>
      type === ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS &&
      payload.colonyAddress === colonyAddress,
    ({ type, payload }) =>
      type === ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR &&
      payload.colonyAddress === colonyAddress,
  );
  return null;
}

function* getTaskStoreContext(draftId: TaskDraftId): Saga<*> {
  /*
   * Get the colony address for the task from the draftId.
   */
  const [colonyAddress] = draftId.split('_');

  /*
   * The task store context inherits the colony store context.
   */
  const { metadata: colonyMetadata, ...colonyContext } = yield call(
    getColonyContext,
    colonyAddress,
  );

  /*
   * Select the possibly-fetched task reference from state.
   */
  let taskMetadata = yield select(taskMetadataSelector, colonyAddress, draftId);

  /*
   * If we don't have the required metadata, fetch it from the colony
   * (if this isn't happening already) and re-select the metadata from state.
   */
  if (!(taskMetadata && taskMetadata.taskStoreAddress)) {
    yield call(fetchColonyTaskMetadata, colonyAddress);
    taskMetadata = yield select(taskMetadataSelector, colonyAddress, draftId);
  }

  /*
   * Use the task metadata to complete the task context.
   */
  return {
    ...colonyContext,
    metadata: {
      ...colonyMetadata,
      ...taskMetadata.toJS(),
      draftId,
    },
  };
}

function* taskCreate({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.TASK_CREATE>): Saga<void> {
  try {
    const context = yield call(getColonyContext, colonyAddress);
    const creatorAddress = context.wallet.address;
    const { taskStore, commentsStore, draftId, event } = yield* executeCommand(
      context,
      createTask,
      { creatorAddress },
    );
    const {
      record: { colonyName },
    } = yield select(colonySelector, colonyAddress);

    const successAction: Action<typeof ACTIONS.TASK_CREATE_SUCCESS> = {
      type: ACTIONS.TASK_CREATE_SUCCESS,
      payload: {
        colonyAddress,
        commentsStoreAddress: commentsStore.address.toString(),
        draftId,
        event,
        taskStoreAddress: taskStore.address.toString(),
        task: {
          colonyAddress,
          draftId,
          creatorAddress,
        },
      },
      meta: { keyPath: [draftId], ...meta },
    };
    /*
     * Put the success action, subscribe to the task and redirect to it
     */
    yield all([
      put(successAction),
      put(subscribeToTask(draftId)),
      put(replace(`/colony/${colonyName}/task/${draftId}`)),
    ]);
  } catch (error) {
    yield putError(ACTIONS.TASK_CREATE_ERROR, error, meta);
  }
}

// TODO simplify this in #965.
const getTaskFetchSuccessPayload = (
  { draftId }: *,
  { metadata: { colonyAddress, taskStoreAddress } }: *,
  {
    amountPaid,
    commentsStoreAddress,
    finalizedAt,
    invites,
    paymentId,
    paymentToken = '',
    payout,
    requests,
    status: currentState,
    ...task
  }: *,
) => ({
  colonyAddress,
  commentsStoreAddress,
  draftId,
  task: {
    ...task,
    colonyAddress,
    currentState,
    draftId,
    invites,
    payouts: paymentToken
      ? [
          {
            // TODO consider using strings for amounts in TaskPayout
            amount: parseInt(payout, 10),
            // TODO get the token name, or even alter TaskType so that we use
            // token addresses and amounts only (not name or symbol)
            token: { address: paymentToken, name: 'Token', symbol: 'TKN' },
          },
        ]
      : undefined,
    requests,
  },
  taskStoreAddress,
});

/*
 * Given a colony address and a task draft ID, fetch the task from its store.
 */
function* taskFetch({
  meta,
  payload: { draftId },
  payload,
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const taskData = yield* executeQuery(context, getTask);
    yield put<Action<typeof ACTIONS.TASK_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_SUCCESS,
      payload: getTaskFetchSuccessPayload(payload, context, taskData),
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
  payload: { draftId, description },
}: Action<typeof ACTIONS.TASK_SET_DESCRIPTION>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskDescription, {
      description,
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DESCRIPTION_SUCCESS>>({
      type: ACTIONS.TASK_SET_DESCRIPTION_SUCCESS,
      meta,
      payload: {
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
  payload: { draftId, title },
}: Action<typeof ACTIONS.TASK_SET_TITLE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskTitle, { title });
    yield put<Action<typeof ACTIONS.TASK_SET_TITLE_SUCCESS>>({
      type: ACTIONS.TASK_SET_TITLE_SUCCESS,
      meta,
      payload: {
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
  payload: { draftId, domainId },
}: Action<typeof ACTIONS.TASK_SET_DOMAIN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskDomain, {
      domainId,
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DOMAIN_SUCCESS>>({
      type: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
      meta,
      payload: {
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
  payload: { draftId },
}: Action<typeof ACTIONS.TASK_CANCEL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, cancelTask, {
      draftId,
    });

    yield put<Action<typeof ACTIONS.TASK_CANCEL_SUCCESS>>({
      type: ACTIONS.TASK_CANCEL_SUCCESS,
      meta,
      payload: {
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
  payload: { draftId },
}: Action<typeof ACTIONS.TASK_CLOSE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, closeTask);

    yield put<Action<typeof ACTIONS.TASK_CLOSE_SUCCESS>>({
      type: ACTIONS.TASK_CLOSE_SUCCESS,
      meta,
      payload: {
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
  payload: { draftId, skillId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskSkill, { skillId });

    yield put<Action<typeof ACTIONS.TASK_SET_SKILL_SUCCESS>>({
      type: ACTIONS.TASK_SET_SKILL_SUCCESS,
      payload: {
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
  payload: { draftId, token, amount },
  meta,
}: Action<typeof ACTIONS.TASK_SET_PAYOUT>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskPayout, {
      token,
      amount,
    });

    yield put<Action<typeof ACTIONS.TASK_SET_PAYOUT_SUCCESS>>({
      type: ACTIONS.TASK_SET_PAYOUT_SUCCESS,
      payload: {
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
  payload: { dueDate, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DUE_DATE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, setTaskDueDate, {
      dueDate: dueDate.getTime(),
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DUE_DATE_SUCCESS>>({
      type: ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
      payload: {
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
  payload: { draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const { workerAddress, amountPaid } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, finalizeTask, {
      amountPaid,
      workerAddress,
    });
    yield put<Action<typeof ACTIONS.TASK_FINALIZE_SUCCESS>>({
      type: ACTIONS.TASK_FINALIZE_SUCCESS,
      payload: {
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
  payload: { draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_INVITE>): Saga<void> {
  try {
    const { workerAddress } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, sendWorkInvite, {
      workerAddress,
    });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
      payload: {
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
  payload: { draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, createWorkRequest, {
      workerAddress: context.wallet.address,
    });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
      payload: {
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
  payload: { draftId, workerAddress },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_ASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, assignWorker, {
      workerAddress,
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
      payload: {
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
  payload: { draftId, workerAddress },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_UNASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(draftId);
    const { event } = yield* executeCommand(context, unassignWorker, {
      workerAddress,
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS,
      payload: {
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
  payload: { draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH>): Saga<void> {
  try {
    const context = yield call(getTaskStoreContext, draftId);
    const events = yield* executeQuery(context, getTaskFeedItems);
    yield put<Action<typeof ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS,
      meta,
      payload: {
        draftId,
        events,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FEED_ITEMS_FETCH_ERROR, error, meta);
  }
}

function* taskCommentAdd({
  payload: { draftId, commentData, taskTitle },
  meta,
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    const commentsContext = yield call(getTaskStoreContext, draftId);
    const { inboxStoreAddress } = yield select(currentUserMetadataSelector);
    const walletAddress = yield select(walletAddressSelector);
    const { wallet } = commentsContext;
    const inboxContext = {
      ddb: yield* getContext(CONTEXT.DDB_INSTANCE),
      metadata: {
        walletAddress,
        inboxStoreAddress,
      },
    };
    /*
     * TODO Wire message signing to the Gas Station, once it's available
     */
    const signature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    const { event } = yield* executeCommand(commentsContext, postComment, {
      signature,
      content: {
        id: nanoid(),
        author: wallet.address,
        ...commentData,
      },
    });

    /*
     * @TODO We need to filter out mentioned users from `commentData`.
     * In the old beta we used to use `linkify-it` to achieve that
     *
     * See: https://github.com/JoinColony/colonyDapp/issues/1011 for the
     * implementation details regarding this
     *
     * Also, this should be iterated through each mentioned user, and add
     * a notification event to each one's store
     */
    yield* executeCommand(inboxContext, commentMentionNotification, {
      event: 'notificationUserMentioned',
      taskTitle,
      comment: commentData.body,
    });

    yield put<Action<typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS>>({
      type: ACTIONS.TASK_COMMENT_ADD_SUCCESS,
      payload: {
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
    yield put<Action<typeof ACTIONS.USER_ACTIVITIES_ADD_SUCCESS>>({
      type: ACTIONS.USER_ACTIVITIES_ADD_SUCCESS,
      payload: {
        activity: {
          id: nanoid(),
          event: 'notificationUserMentioned',
          userAddress: walletAddress,
          taskTitle,
          comment: commentData.body,
          timestamp: commentData.timestamp,
        },
      },
      meta,
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
