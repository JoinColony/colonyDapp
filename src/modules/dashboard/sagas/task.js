/* @flow */

import type { Saga } from 'redux-saga';
import type { ENSName } from '~types';
import type { Action } from '~redux';

import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { CONTEXT, getContext } from '~context';

import { putError, executeCommand, executeQuery } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { allColonyENSNames } from '../selectors';

import {
  createTask,
  updateTask,
  postComment,
  finalizeTask,
  setTaskSkill,
  setTaskBounty,
  setTaskDueDate,
  cancelTask,
  closeTask,
  createWorkRequest,
  sendWorkInvite,
  assignWorker,
  unassignWorker,
} from '../../../data/service/commands';
import {
  getTaskComments,
  getColonyTasks,
  getTask,
} from '../../../data/service/queries';

function* getStoreContext(
  colonyENSName: string,
  taskStoreAddress: ?string,
): Saga<Object> {
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
      taskStoreAddress,
    },
  };
}

function* taskCreate({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload,
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName);
    const { taskId, domainId, title, description } = payload;
    yield* executeCommand(context, createTask, {
      taskId,
      domainId,
      title,
      description,
    });

    // TODO get the task store and fetch it, after https://github.com/JoinColony/colonyDapp/pull/815
    // TODO: check if taskRecord has commentStoreAdress prop if so fetch them as well with
    // taskCommentsSaga
    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_SUCCESS,
      payload,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name a task ID, fetch the task from its store.
 * Optionally, the `taskStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* taskFetch({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  // @FIXME: we could fetch it via taskId as well, if we have a map on state for taskId => store address
  payload: { taskStoreAddress },
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    const task = yield* executeQuery(context, getTask);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_FETCH_SUCCESS>>({
      type: ACTIONS.TASK_FETCH_SUCCESS,
      payload: task,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_ERROR, error, meta);
  }
}

// @TODO: Move this to colony sagas?
/*
 * Given a colony ENS name, dispatch actions to fetch all tasks
 * for that colony.
 */
function* fetchAllTasksForColony(colonyENSName: ENSName, meta): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName);
    const colonyTasks = yield* executeQuery(context, getColonyTasks);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_FETCH_TASKS_SUCCESS>>({
      type: ACTIONS.COLONY_FETCH_TASKS_SUCCESS,
      payload: { colonyENSName, colonyTasks },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_FETCH_TASKS_ERROR, error, meta);
  }
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* taskFetchAll({ meta }): Saga<void> {
  const colonyENSNames = yield select(allColonyENSNames);
  yield all(
    colonyENSNames.map(colonyENSName =>
      call(fetchAllTasksForColony, colonyENSName, meta),
    ),
  );
}

/*
 * Given a colony ENS name, a task ID and task props, get the task store
 * and update it.
 */
function* taskUpdate({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload,
}: Action<typeof ACTIONS.TASK_UPDATE>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName);
    yield* executeCommand(context, updateTask, payload);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_UPDATE_SUCCESS>>({
      type: ACTIONS.TASK_UPDATE_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_UPDATE_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* taskCancel({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload: { taskId, domainId, taskStoreAddress },
}: Action<typeof ACTIONS.TASK_CANCEL>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, cancelTask, { taskId, domainId });

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_CANCEL_SUCCESS>>({
      type: ACTIONS.TASK_CANCEL_SUCCESS,
      meta,
      payload: undefined,
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
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload: { taskId, taskStoreAddress },
}: Action<typeof ACTIONS.TASK_CLOSE>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, closeTask);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_CLOSE_SUCCESS>>({
      type: ACTIONS.TASK_CLOSE_SUCCESS,
      meta,
      payload: { taskId },
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_CLOSE_ERROR, error, meta);
  }
}

/**
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetSkill({
  payload: { taskStoreAddress, taskId, skillId },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, setTaskSkill, { skillId });
    yield put({
      type: ACTIONS.TASK_SET_SKILL_SUCCESS,
      payload: {
        taskId,
        skillId,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_SKILL_ERROR, error, meta);
  }
}

/**
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetBounty({
  payload: { taskStoreAddress, taskId, token, amount },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.TASK_SET_PAYOUT>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, setTaskBounty, { token, amount });
    yield put({
      type: ACTIONS.TASK_SET_PAYOUT_SUCCESS,
      payload: {
        taskId,
        amount,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_PAYOUT_ERROR, error, meta);
  }
}

/**
 * As worker or manager, I want to be able to set a date
 */
function* taskSetDueDate({
  payload: { colonyENSName, taskStoreAddress, dueDate, taskId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DATE>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, setTaskDueDate, { dueDate });
    yield put({
      type: ACTIONS.TASK_SET_DATE_SUCCESS,
      payload: {
        taskId,
        dueDate,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DATE_ERROR, error, meta);
  }
}

/**
 * As anyone, finalize task (`completeTask` group)
 */
function* taskFinalize({
  payload: { taskId, taskStoreAddress, colonyENSName, worker, amountPaid }, // @TODO This should come from the state?
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, finalizeTask, { amountPaid, worker });
    yield put({
      type: ACTIONS.TASK_FINALIZE_SUCCESS,
      payload: {
        taskId,
        worker,
        amountPaid,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FINALIZE_ERROR, error, meta);
  }
}

function* sendWorkInviteSaga({
  payload: { taskId, taskStoreAddress, colonyENSName, worker }, // @TODO This should come from the state?
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_INVITE>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, sendWorkInvite, { worker });
    yield put({
      type: ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
      payload: {
        taskId,
        worker,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_INVITE_ERROR, error, meta);
  }
}

function* createWorkRequestSaga({
  payload: { taskId, taskStoreAddress, colonyENSName, worker },
  meta,
}: Action<typeof ACTIONS.TASK_SEND_WORK_REQUEST>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    const wallet = yield* getContext(CONTEXT.WALLET);
    yield* executeCommand(context, createWorkRequest, {
      worker: wallet.address,
    });
    yield put({
      type: ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
      payload: {
        taskId,
        worker,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_SEND_WORK_REQUEST_ERROR, error, meta);
  }
}

function* assignWorkerSaga({
  payload: { taskId, taskStoreAddress, colonyENSName, worker },
  meta,
}: Action<typeof ACTIONS.TASK_ASSIGN>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, assignWorker, {
      worker,
    });
    yield put({
      type: ACTIONS.TASK_ASSIGN_SUCCESS,
      payload: {
        taskId,
        worker,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_ASSIGN_ERROR, error, meta);
  }
}

function* unassignWorkerSaga({
  payload: { taskId, taskStoreAddress, colonyENSName, worker },
  meta,
}: Action<typeof ACTIONS.TASK_UNASSIGN>): Saga<void> {
  try {
    const context = yield* getStoreContext(colonyENSName, taskStoreAddress);
    yield* executeCommand(context, unassignWorker, {
      worker,
    });
    yield put({
      type: ACTIONS.TASK_UNASSIGN_SUCCESS,
      payload: {
        taskId,
        worker,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_UNASSIGN_ERROR, error, meta);
  }
}

function* taskCommentsSaga({
  payload: { commentsStoreAddress },
  meta,
}: Action<typeof ACTIONS.TASK_FETCH_COMMENTS>): Saga<void> {
  /*
   * Get the comments store for the returned address
   */
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  try {
    const payload = yield* executeQuery(
      { ddb, metadata: { commentsStoreAddress } },
      getTaskComments,
    );
    yield put({
      type: ACTIONS.TASK_FETCH_COMMENTS_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_FETCH_COMMENTS_ERROR, error, meta);
  }
}

function* taskCommentAdd({
  payload: { commentsStoreAddress, taskId, commentData },
  meta,
  meta: { id },
}: Action<typeof ACTIONS.TASK_COMMENT_ADD>): Saga<void> {
  try {
    /*
     * @TODO Wire message signing to the Gas Station, once it's available
     */
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const wallet = yield* getContext(CONTEXT.WALLET);
    const commentSignature = yield call([wallet, wallet.signMessage], {
      message: JSON.stringify(commentData),
    });

    /*
     * @NOTE Put the comment in the DDB Feed Store
     */
    const context = {
      ddb,
      metadata: { commentsStoreAddress },
    };
    yield* executeCommand(context, postComment, {
      signature: commentSignature,
      content: {
        id,
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
        taskId,
        commentData,
        commentsStoreAddress,
        signature: commentSignature,
      },
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_COMMENT_ADD_ERROR, error, meta);
  }
}

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_COMMENT_ADD, taskCommentAdd);
  yield takeEvery(ACTIONS.TASK_FETCH_COMMENTS, taskCommentsSaga);
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetch);
  // @TODO: Move this one to colony sagas
  yield takeEvery(ACTIONS.COLONY_FETCH_TASKS, taskFetchAll);
  yield takeEvery(ACTIONS.TASK_CANCEL, taskCancel);
  yield takeEvery(ACTIONS.TASK_SET_DATE, taskSetDueDate);
  yield takeEvery(ACTIONS.TASK_SET_SKILL, taskSetSkill);
  yield takeEvery(ACTIONS.TASK_SET_PAYOUT, taskSetBounty);
  yield takeEvery(ACTIONS.TASK_CLOSE, taskClose);
  yield takeEvery(ACTIONS.TASK_ASSIGN, assignWorkerSaga);
  yield takeEvery(ACTIONS.TASK_UNASSIGN, unassignWorkerSaga);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_INVITE, sendWorkInviteSaga);
  yield takeEvery(ACTIONS.TASK_SEND_WORK_REQUEST, createWorkRequestSaga);
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreate);
  yield takeEvery(ACTIONS.TASK_UPDATE, taskUpdate);
  yield takeEvery(ACTIONS.TASK_FINALIZE, taskFinalize);
}
