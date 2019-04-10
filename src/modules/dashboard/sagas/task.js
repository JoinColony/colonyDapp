/* @flow */

import type { Saga } from 'redux-saga';
import type { Action } from '~redux';

import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import nanoid from 'nanoid';
import { replace } from 'connected-react-router';

import { CONTEXT, getContext } from '~context';
import {
  executeCommand,
  executeQuery,
  putError,
  raceError,
} from '~utils/saga/effects';
import { shouldFetchData } from '~immutable/utils';
import { ACTIONS } from '~redux';

import {
  allColonyNamesSelector,
  taskRefRecordSelector,
  taskSelector,
} from '../selectors';

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
import { getColonyTasks, getTask, getTaskComments } from '../data/queries';

import { subscribeToTask } from '../../users/actionCreators';

/*
 * If the given colony is not in state, dispatch an action to fetch it,
 * and wait for the success/error action.
 */
export function* maybeFetchColonyTasks(
  colonyName: string,
  draftId: string,
): Saga<*> {
  const taskRef = yield select(taskRefRecordSelector, draftId);

  // Use an infinite TTL because we don't want to refresh it
  if (!shouldFetchData(taskRef, Infinity, false, [colonyName])) return null;

  yield put({
    type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY,
    payload: { colonyName },
  });
  yield raceError(
    ({ type, payload }) =>
      type === ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS &&
      payload.colonyName === colonyName,
    ({ type, payload }) =>
      type === ACTIONS.TASK_FETCH_ALL_FOR_COLONY_ERROR &&
      payload.colonyName === colonyName,
  );
  return null;
}

function* getColonyStoreContext(colonyName: string): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  if (!colonyManager)
    throw new Error('Cannot get colony context. Invalid manager instance');
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyName,
  );
  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyName,
      colonyAddress: colonyClient.contract.address,
    },
  };
}

function* getTaskStoreContext(colonyName: string, draftId: string): Saga<*> {
  const { metadata, ...context } = yield call(
    getColonyStoreContext,
    colonyName,
  );
  yield call(maybeFetchColonyTasks, colonyName, draftId);

  const { taskStoreAddress } = yield select(taskRefRecordSelector, draftId);
  return {
    ...context,
    metadata: {
      ...metadata,
      draftId,
      taskStoreAddress,
    },
  };
}

function* getTaskCommentsStoreContext(
  colonyName: string,
  draftId: string,
): Saga<*> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  yield call(maybeFetchColonyTasks, colonyName, draftId);

  const { commentsStoreAddress } = yield select(taskRefRecordSelector, draftId);
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
  payload: { colonyName },
}: Action<typeof ACTIONS.TASK_CREATE>): Saga<void> {
  try {
    const colonyContext = yield call(getColonyStoreContext, colonyName);
    const creatorAddress = colonyContext.wallet.address;
    const { taskStore, commentsStore, draftId } = yield* executeCommand(
      colonyContext,
      createTask,
      { creatorAddress },
    );

    const successAction: Action<typeof ACTIONS.TASK_CREATE_SUCCESS> = {
      type: ACTIONS.TASK_CREATE_SUCCESS,
      payload: {
        colonyName,
        commentsStoreAddress: commentsStore.address.toString(),
        draftId,
        taskStoreAddress: taskStore.address.toString(),
        task: {
          colonyName,
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
  { colonyName, draftId }: *,
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
  colonyName,
  commentsStoreAddress,
  draftId,
  task: {
    ...task,
    colonyName,
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
 * Given a colony ENS name a task ID, fetch the task from its store.
 * Optionally, the `taskStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* taskFetch({
  meta,
  payload: { colonyName, draftId },
  payload,
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { colonyName },
}: Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY>): Saga<void> {
  try {
    const context = yield* getColonyStoreContext(colonyName);
    const colonyTasks = yield* executeQuery(context, getColonyTasks);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS,
      payload: { colonyName, colonyTasks },
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
  const colonyNames = yield select(allColonyNamesSelector);
  yield all(
    colonyNames.map(colonyName =>
      put<Action<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY>>({
        type: ACTIONS.TASK_FETCH_ALL_FOR_COLONY,
        payload: { colonyName },
      }),
    ),
  );
}

function* taskSetDescription({
  meta,
  payload: { colonyName, draftId, description },
  payload,
}: Action<typeof ACTIONS.TASK_SET_DESCRIPTION>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { colonyName, draftId, title },
  payload,
}: Action<typeof ACTIONS.TASK_SET_TITLE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { colonyName, draftId, domainId },
  payload,
}: Action<typeof ACTIONS.TASK_SET_DOMAIN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { draftId, colonyName },
  payload,
}: Action<typeof ACTIONS.TASK_CANCEL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { draftId, colonyName },
  payload,
}: Action<typeof ACTIONS.TASK_CLOSE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { draftId, skillId, colonyName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { colonyName, draftId, token, amount },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SET_PAYOUT>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { colonyName, dueDate, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DUE_DATE>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
    yield* executeCommand(context, setTaskDueDate, {
      dueDate: dueDate.getTime(),
    });
    yield put<Action<typeof ACTIONS.TASK_SET_DUE_DATE_SUCCESS>>({
      type: ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
      payload: {
        colonyName,
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
  payload: { draftId, colonyName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const { worker, amountPaid } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { draftId, colonyName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_INVITE>): Saga<void> {
  try {
    const { worker } = yield select(taskSelector, draftId);
    const context = yield* getTaskStoreContext(colonyName, draftId);
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
  payload: { draftId, colonyName },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
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

function* taskWorkerAssign({
  payload: { draftId, colonyName, worker },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_ASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
    yield* executeCommand(context, assignWorker, {
      worker,
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_ASSIGN_ERROR, error, meta);
  }
}

function* taskWorkerUnassign({
  payload: { draftId, colonyName, worker },
  payload,
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_UNASSIGN>): Saga<void> {
  try {
    const context = yield* getTaskStoreContext(colonyName, draftId);
    yield* executeCommand(context, unassignWorker, {
      worker,
    });
    yield put<Action<typeof ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS>>({
      type: ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_UNASSIGN_ERROR, error, meta);
  }
}

// TODO in #580 replace with fetching feed items
function* taskFetchComments({
  payload: { colonyName, draftId },
  meta,
}: Action<typeof ACTIONS.TASK_FETCH_COMMENTS>): Saga<void> {
  try {
    const context = yield call(
      getTaskCommentsStoreContext,
      colonyName,
      draftId,
    );
    const comments = yield* executeQuery(context, getTaskComments);
    yield put<Action<typeof ACTIONS.TASK_FETCH_COMMENTS_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_COMMENTS_SUCCESS,
      meta,
      payload: {
        colonyName,
        comments,
        draftId,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_COMMENTS_ERROR, error, meta);
  }
}

function* taskCommentAdd({
  payload: { draftId, commentData, colonyName },
  meta,
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    const context = yield call(
      getTaskCommentsStoreContext,
      colonyName,
      draftId,
    );
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
        id: nanoid(),
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
        colonyName,
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

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_CANCEL, taskCancel);
  yield takeEvery(ACTIONS.TASK_CLOSE, taskClose);
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreate);
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetch);
  yield takeEvery(ACTIONS.TASK_FETCH_ALL, taskFetchAll);
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
  yield takeEvery(ACTIONS.TASK_WORKER_ASSIGN, taskWorkerAssign);
  yield takeEvery(ACTIONS.TASK_WORKER_UNASSIGN, taskWorkerUnassign);
}
