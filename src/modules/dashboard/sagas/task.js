/* @flow */

import type { Saga } from 'redux-saga';
import type { Action } from '~redux';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { CONTEXT, getContext } from '~context';

import { putError, executeCommand, executeQuery } from '~utils/saga/effects';
import { ACTIONS } from '~redux';
import {
  allColonyENSNames,
  taskSelector,
  taskStorePropsSelector,
} from '../selectors';
import { currentUserMetadataSelector } from '../../users/selectors';

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
  subscribeToTask,
  unassignWorker,
} from '../../../data/service/commands';
import {
  getColonyTasks,
  getTask,
  getTaskComments,
  getUserTasks,
} from '../../../data/service/queries';

function* getColonyStoreContext(colonyENSName: string): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  if (!colonyManager)
    throw new Error('Cannot get colony context. Invalid manager instance');
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyENSName,
  );
  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyENSName,
      colonyAddress: colonyClient.contract.address,
    },
  };
}

function* getUserMetadataStoreContext(): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const { metadataStoreAddress: userMetadataStoreAddress } = yield select(
    currentUserMetadataSelector,
  );
  return {
    ddb,
    wallet,
    metadata: {
      userMetadataStoreAddress,
      walletAddress: wallet.address,
    },
  };
}

function* getTaskStoreContext(colonyENSName: string, draftId: string): Saga<*> {
  const { metadata, ...context } = yield call(
    getColonyStoreContext,
    colonyENSName,
  );
  /*
   * By selecting the taskStoreAddress from the redux store, we are assuming
   * it is already in state. If we encounter problems here, we'll want to either
   * fetch the task reference, or supply taskStoreAddress in the action.
   */
  const { taskStoreAddress } = yield select(taskStorePropsSelector, {
    draftId,
  });
  return {
    ...context,
    metadata: {
      ...metadata,
      taskStoreAddress,
    },
  };
}

function* getTaskCommentsStoreContext(draftId: string): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  /*
   * By selecting the commentsStoreAddress from the redux store, we are assuming
   * it is already in state. If we encounter problems here, we'll want to either
   * fetch the task reference, or supply commentsStoreAddress in the action.
   */
  const { commentsStoreAddress } = yield select(taskStorePropsSelector, {
    draftId,
  });
  return {
    ddb,
    wallet,
    metadata: {
      commentsStoreAddress,
    },
  };
}

function* taskCreate({
  meta,
  payload: { colonyENSName },
}: Action<typeof ACTIONS.TASK_CREATE>): Saga<void> {
  try {
    const colonyContext = yield call(getColonyStoreContext, colonyENSName);
    const metadataContext = yield call(getUserMetadataStoreContext);
    const { taskStore, commentsStore, draftId } = yield* executeCommand(
      colonyContext,
      createTask,
      {
        creator: colonyContext.wallet.address,
      },
    );
    yield* executeCommand(metadataContext, subscribeToTask, { draftId });

    yield put<Action<typeof ACTIONS.TASK_CREATE_SUCCESS>>({
      type: ACTIONS.TASK_CREATE_SUCCESS,
      payload: {
        colonyENSName,
        commentsStoreAddress: commentsStore.address.toString(),
        draftId,
        taskStoreAddress: taskStore.address.toString(),
        task: {
          colonyENSName,
          draftId,
        },
      },
      meta: { keyPath: [draftId], ...meta },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CREATE_ERROR, error, meta);
  }
}

// TODO handle this in the data layer with some handy abstraction
// (at least the `task` part).
const getTaskFetchSuccessPayload = (
  { colonyENSName, draftId }: *,
  { metadata: { taskStoreAddress } }: *,
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
  colonyENSName,
  commentsStoreAddress,
  draftId,
  task: {
    ...task,
    colonyENSName,
    currentState,
    draftId,
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
  },
  taskStoreAddress,
});

/*
 * Given a colony ENS name a task ID, fetch the task from its store.
 * Optionally, the `taskStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* taskFetch({
  meta,
  payload: { colonyENSName, draftId },
  payload,
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
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

// TODO: Move this to colony sagas?
/*
 * Given a colony ENS name, dispatch actions to fetch all tasks
 * for that colony.
 */
function* taskFetchAllForColony({
  payload: { colonyENSName },
}: Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY>): Saga<void> {
  try {
    const context = yield* getColonyStoreContext(colonyENSName);
    const colonyTasks = yield* executeQuery(context, getColonyTasks);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS,
      payload: { colonyENSName, colonyTasks },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_ALL_FOR_COLONY_ERROR, error);
  }
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* taskFetchAll(): Saga<void> {
  const colonyENSNames = yield select(allColonyENSNames);
  yield all(
    colonyENSNames.map(colonyENSName =>
      put<Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY>>({
        type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY,
        payload: { colonyENSName },
      }),
    ),
  );
}

function* taskSetDescription({
  meta,
  payload: { colonyENSName, draftId, description },
  payload,
}: Action<typeof ACTIONS.TASK_SET_DESCRIPTION>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskDescription, { description });
    yield put<Action<typeof ACTIONS.TASK_SET_DESCRIPTION_SUCCESS>>({
      type: ACTIONS.TASK_SET_DESCRIPTION_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DESCRIPTION_ERROR, error, meta);
  }
}

function* taskSetTitle({
  meta,
  payload: { colonyENSName, draftId, title },
  payload,
}: Action<typeof ACTIONS.TASK_SET_TITLE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskTitle, { title });
    yield put<Action<typeof ACTIONS.TASK_SET_TITLE_SUCCESS>>({
      type: ACTIONS.TASK_SET_TITLE_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_TITLE_ERROR, error, meta);
  }
}

function* taskSetDomain({
  meta,
  payload: { colonyENSName, draftId, domainId },
  payload,
}: Action<typeof ACTIONS.TASK_SET_DOMAIN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskDomain, { domainId });
    yield put<Action<typeof ACTIONS.TASK_SET_DOMAIN_SUCCESS>>({
      type: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DOMAIN_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskCancel({
  meta,
  payload: { draftId, colonyENSName },
  payload,
}: Action<typeof ACTIONS.TASK_CANCEL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, cancelTask, { draftId });

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_CANCEL_SUCCESS>>({
      type: ACTIONS.TASK_CANCEL_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CANCEL_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskClose({
  meta,
  payload: { draftId, colonyENSName },
  payload,
}: Action<typeof ACTIONS.TASK_CLOSE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, closeTask);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_CLOSE_SUCCESS>>({
      type: ACTIONS.TASK_CLOSE_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CLOSE_ERROR, error, meta);
  }
}

/*
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetSkill({
  payload: { draftId, skillId, colonyENSName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskSkill, { skillId });
    yield put<Action<typeof ACTIONS.TASK_SET_SKILL_SUCCESS>>({
      type: ACTIONS.TASK_SET_SKILL_SUCCESS,
      payload,
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
  payload: { colonyENSName, draftId, token, amount },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SET_PAYOUT>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskPayout, { token, amount });
    yield put<Action<typeof ACTIONS.TASK_SET_PAYOUT_SUCCESS>>({
      type: ACTIONS.TASK_SET_PAYOUT_SUCCESS,
      payload,
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
  payload: { colonyENSName, dueDate, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DUE_DATE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, setTaskDueDate, { dueDate });
    yield put<Action<typeof ACTIONS.TASK_SET_DUE_DATE_SUCCESS>>({
      type: ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
      payload: {
        colonyENSName,
        draftId,
        dueDate,
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
  payload: { draftId, colonyENSName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const { worker, amountPaid } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, finalizeTask, { amountPaid, worker });
    yield put<Action<typeof ACTIONS.TASK_FINALIZE_SUCCESS>>({
      type: ACTIONS.TASK_FINALIZE_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FINALIZE_ERROR, error, meta);
  }
}

function* taskSendWorkInvite({
  payload: { draftId, colonyENSName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_INVITE>): Saga<void> {
  try {
    const { worker } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, sendWorkInvite, { worker });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_INVITE_ERROR, error, meta);
  }
}

function* taskSendWorkRequest({
  payload: { draftId, colonyENSName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    const wallet = yield* getContext(CONTEXT.WALLET);
    const worker = wallet.address;
    yield* executeCommand(context, createWorkRequest, { worker });
    yield put<Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS>>({
      type: ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
      payload: { ...payload, worker },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_REQUEST_ERROR, error, meta);
  }
}

function* taskAssign({
  payload: { draftId, colonyENSName, worker },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_ASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, assignWorker, {
      worker,
    });
    yield put<Action<typeof ACTIONS.TASK_ASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_ASSIGN_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_ASSIGN_ERROR, error, meta);
  }
}

function* taskUnassign({
  payload: { draftId, colonyENSName, worker },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_UNASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyENSName, draftId);
    yield* executeCommand(context, unassignWorker, {
      worker,
    });
    yield put<Action<typeof ACTIONS.TASK_UNASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_UNASSIGN_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_UNASSIGN_ERROR, error, meta);
  }
}

function* taskFetchComments({
  payload: { colonyENSName, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FETCH_COMMENTS>): Saga<void> {
  try {
    const context = yield call(getTaskCommentsStoreContext, draftId);
    const comments = yield* executeQuery(context, getTaskComments);
    yield put<Action<typeof ACTIONS.TASK_FETCH_COMMENTS_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_COMMENTS_SUCCESS,
      meta,
      payload: {
        colonyENSName,
        comments,
        draftId,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_COMMENTS_ERROR, error, meta);
  }
}

function* taskCommentAdd({
  payload: { draftId, commentData, colonyENSName },
  meta,
  meta: { id },
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    const context = yield call(getTaskCommentsStoreContext, draftId);
    const { wallet } = context;
    /*
     * TODO Wire message signing to the Gas Station, once it's available
     */
    const signature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    yield* executeCommand(context, postComment, {
      signature,
      content: {
        id, // TODO why use the action ID here rather than a new nanoid?
        author: wallet.address,
        ...commentData,
      },
    });

    /*
     * @NOTE If the above is sucessfull, put the comment in the Redux Store as well
     */
    yield put<Action<typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS>>({
      type: ACTIONS.TASK_COMMENT_ADD_SUCCESS,
      payload: {
        colonyENSName,
        commentData,
        draftId,
        signature,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

function* taskFetchIdsForCurrentUser(): Saga<*> {
  try {
    const context = yield call(getUserMetadataStoreContext);
    const tasks = yield* executeQuery(getUserTasks, context);
    yield put<Action<typeof ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS,
      payload: tasks,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_ERROR, error);
  }
}

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_ASSIGN, taskAssign);
  yield takeEvery(ACTIONS.TASK_CANCEL, taskCancel);
  yield takeEvery(ACTIONS.TASK_CLOSE, taskClose);
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreate);
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetch);
  yield takeEvery(ACTIONS.TASK_FETCH_ALL, taskFetchAll);
  yield takeEvery(
    ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER,
    taskFetchIdsForCurrentUser,
  );
  yield takeEvery(ACTIONS.TASK_FETCH_ALL_FOR_COLONY, taskFetchAllForColony);
  yield takeEvery(ACTIONS.TASK_FETCH_COMMENTS, taskFetchComments);
  yield takeEvery(ACTIONS.TASK_FINALIZE, taskFinalize);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_INVITE, taskSendWorkInvite);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_REQUEST, taskSendWorkRequest);
  yield takeEvery(ACTIONS.TASK_SET_DESCRIPTION, taskSetDescription);
  yield takeEvery(ACTIONS.TASK_SET_DOMAIN, taskSetDomain);
  yield takeEvery(ACTIONS.TASK_SET_DUE_DATE, taskSetDueDate);
  yield takeEvery(ACTIONS.TASK_SET_PAYOUT, taskSetPayout);
  yield takeEvery(ACTIONS.TASK_SET_SKILL, taskSetSkill);
  yield takeEvery(ACTIONS.TASK_SET_TITLE, taskSetTitle);
  yield takeEvery(ACTIONS.TASK_UNASSIGN, taskUnassign);
}
