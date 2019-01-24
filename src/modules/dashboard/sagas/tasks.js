/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  getContext,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';

import type { ENSName, UniqueActionWithKeyPath } from '~types';
import type { TaskId } from '~immutable';
import type { ValidatedKVStore, Store } from '../../../lib/database/stores';

import { putError, raceError, callCaller } from '~utils/saga/effects';

import { set, get, getAll, remove } from '../../../lib/database/commands';
import { COLONY_CONTEXT } from '../../../lib/ColonyManager/constants';
import {
  setTaskDueDateTx,
  setTaskSkillTx,
  finalizeTaskTx,
  completeTaskTx,
  submitWorkerRatingAsManagerTx,
  revealTaskRatingAsManagerTx,
  claimPayoutAsWorkerTx,
  submitTaskDeliverableAndRatingTx,
  submitManagerRatingAsWorkerTx,
  revealTaskRatingAsWorkerTx,
} from '../actionCreators';
import { allColonyENSNames } from '../selectors';
import { taskStoreBlueprint } from '../stores';
import {
  TASK_CREATE,
  TASK_CREATE_ERROR,
  TASK_CREATE_SUCCESS,
  TASK_FETCH,
  TASK_FETCH_ALL,
  TASK_FETCH_ERROR,
  TASK_FETCH_SUCCESS,
  TASK_FINALIZE,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_MANAGER_RATE_WORKER,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_MANAGER_REVEAL_WORKER_RATING,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_REMOVE,
  TASK_REMOVE_ERROR,
  TASK_REMOVE_SUCCESS,
  TASK_SET_DATE,
  TASK_SET_SKILL,
  TASK_UPDATE,
  TASK_UPDATE_ERROR,
  TASK_UPDATE_SUCCESS,
  TASK_WORKER_CLAIM_REWARD,
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_WORKER_RATE_MANAGER,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
} from '../actionTypes';
import {
  ensureColonyIsInState,
  getTasksIndexStore,
  getOrCreateTasksIndexStore,
} from './shared';

// TODO
const taskStoreAddressSelector = () => null;

const addStoreAddressesToTaskPayload = (
  payload: Object,
  taskStore: ValidatedKVStore,
  feedItemsStore?: Store, // TODO set store type when the store is defined
) => ({
  databases: {
    taskStore: taskStore.address.toString(),
    feedItemsStore:
      payload.feedItems ||
      (feedItemsStore && feedItemsStore.address.toString()) ||
      undefined,
  },
  ...payload,
});

/*
 * Given a colony ENS name and a task ID, get or create the feed items
 * store for that task ID.
 */
// eslint-disable-next-line no-unused-vars
function* getOrCreateFeedItemsStore(colonyENSName: ENSName, id: TaskId) {
  // TODO actually get or create a store (when the store is defined)
  return yield {
    address: {
      toString() {
        return 'TODO replace me';
      },
    },
  };
}

function* getTaskStoreFromAddress(taskStoreAddress: string): Saga<void> {
  const ddb = yield getContext('ddb');
  // TODO no access controller available yet
  return yield call([ddb, ddb.getStore], taskStoreBlueprint, taskStoreAddress);
}

function* getTaskStore(
  colonyENSName: ENSName,
  id: TaskId,
): Saga<?ValidatedKVStore> {
  /*
   * Firstly, attempt to find the task store address from the app state.
   */
  let taskStoreAddress = yield select(taskStoreAddressSelector, {
    colonyENSName,
    id,
  });

  /*
   * If it wasn't found, use the tasks index store to see if it exists there.
   */
  if (!taskStoreAddress) {
    const tasksIndexStore = yield call(getTasksIndexStore, colonyENSName);
    yield call([tasksIndexStore, tasksIndexStore.load]);
    taskStoreAddress = yield call(get, tasksIndexStore, id);
  }

  /*
   * If we found the task store address, return the store (without loading it).
   */
  if (taskStoreAddress) yield call(getTaskStoreFromAddress, taskStoreAddress);

  /*
   * If we couldn't find any store address, return null.
   */
  return null;
}

function* createTaskStore(colonyENSName: ENSName): Saga<ValidatedKVStore> {
  const ddb = yield getContext('ddb');
  // TODO no access controller available yet
  return yield call([ddb, ddb.createStore], taskStoreBlueprint, {
    meta: {
      colonyENSName,
    },
  });
}

/*
 * Given a tasks index store, a colony ENS name and a task ID,
 * get or create the task store.
 */
function* getOrCreateTaskStore(
  colonyENSName: ENSName,
  id: TaskId,
): Saga<ValidatedKVStore> {
  /*
   * Get and load the task store, if it exists already.
   */
  let store = yield call(getTaskStore, colonyENSName, id);
  if (store) yield call([store, store.load]);

  /*
   * If necessary, create the task store.
   */
  if (!store) store = yield call(createTaskStore, colonyENSName);

  return store;
}

function* createTaskSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload: { id },
  payload,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get or create the tasks index store for this colony.
     */
    const tasksIndexStore = yield call(
      getOrCreateTasksIndexStore,
      colonyENSName,
    );

    /*
     * Get or create the store for this task.
     */
    const taskStore = yield call(getOrCreateTaskStore, colonyENSName, id);

    /*
     * Get or create the feed items store for this task.
     */
    const feedItemsStore = yield call(
      getOrCreateFeedItemsStore,
      colonyENSName,
      id,
    );

    /*
     * Set the task props to the task store.
     * TODO: ideally guard against re-writing the same values (if this saga
     * failed part-way through before)
     */
    yield call(set, taskStore, {
      feedItems: feedItemsStore.address.toString(),
      ...payload,
    });

    /*
     * Add the task store address to the tasks index store (for this task ID).
     */
    const taskStoreAddress = taskStore.address.toString();
    yield call(set, tasksIndexStore, id, taskStoreAddress);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: TASK_CREATE_SUCCESS,
      meta: {
        ...meta,
        keyPath: [colonyENSName, id],
      },
      payload: addStoreAddressesToTaskPayload(
        payload,
        taskStore,
        feedItemsStore,
      ),
    });
  } catch (error) {
    yield putError(TASK_CREATE_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name a task ID, fetch the task from its store.
 * Optionally, the `taskStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* fetchTaskSaga({
  meta: {
    keyPath: [colonyENSName, id],
    keyPath,
  },
  payload: { taskStoreAddress },
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get and load the task store.
     */
    const taskStore = taskStoreAddress
      ? yield call(getTaskStoreFromAddress, taskStoreAddress)
      : yield call(getTaskStore, colonyENSName, id);
    yield call([taskStore, taskStore.load]);

    /*
     * Get all the values from the task store.
     */
    const taskStoreData = yield call(getAll, taskStore);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: TASK_FETCH_SUCCESS,
      payload: {
        keyPath,
        props: addStoreAddressesToTaskPayload(taskStoreData, taskStore),
      },
    });
  } catch (error) {
    yield putError(TASK_FETCH_ERROR, error, { keyPath });
  }
}

/*
 * Given a colony ENS name, dispatch actions to fetch all tasks
 * for that colony.
 */
function* fetchAllTasksForColony(colonyENSName: ENSName): Saga<void> {
  /*
   * Get and load the tasks index store for this colony.
   */
  const tasksIndexStore = yield call(getTasksIndexStore, colonyENSName);
  yield call([tasksIndexStore, tasksIndexStore.load]);

  /*
   * Iterate over the task IDs/store addresses in the index,
   * and dispatch an action to fetch the task.
   */
  const tasksIndex = yield call(getAll, tasksIndexStore);
  yield all(
    Object.entries(tasksIndex).map(([id, taskStoreAddress]) =>
      put({
        type: TASK_FETCH,
        payload: {
          keyPath: [colonyENSName, id],
          taskStoreAddress,
        },
      }),
    ),
  );
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* fetchAllTasksSaga(): Saga<void> {
  const colonyENSNames = yield select(allColonyENSNames);
  yield all(
    colonyENSNames.map(colonyENSName =>
      call(fetchAllTasksForColony, colonyENSName),
    ),
  );
}

/*
 * Given a colony ENS name, a task ID and task props, get the task store
 * and update it.
 */
function* updateTaskSaga({
  meta: {
    keyPath: [colonyENSName, id],
  },
  meta,
  payload,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get the task store.
     */
    const taskStore = yield call(getTaskStore, colonyENSName, id);

    /*
     * Set all of the given props on the task store.
     */
    yield call(set, taskStore, payload);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: TASK_UPDATE_SUCCESS,
      meta,
      payload: addStoreAddressesToTaskPayload(payload, taskStore),
    });
  } catch (error) {
    yield putError(TASK_UPDATE_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name and task ID, remove the task by unsetting
 * the corresponding key in the tasks index store. The task store is
 * simply unpinned.
 */
function* removeTaskSaga({
  meta: {
    keyPath: [colonyENSName, id],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Stop pinning the task store, if it could be found.
     * TODO: this would also be the place to disconnect the store,
     * removing it from the DDB cache.
     */
    const taskStore = yield call(getTaskStore, colonyENSName, id);
    if (taskStore) yield call([taskStore, taskStore.unpin]);

    /*
     * Remove the entry for this task on the tasks index store.
     */
    const tasksIndexStore = yield call(getTasksIndexStore, colonyENSName);
    yield call(remove, tasksIndexStore, id);

    /*
     * Dispatch the success action.
     */
    yield put({ type: TASK_REMOVE_SUCCESS, meta });
  } catch (error) {
    yield putError(TASK_REMOVE_ERROR, error, meta);
  }
}

function* generateRatingSalt(colonyENSName: ENSName, taskId: number) {
  const wallet = yield getContext('wallet');
  const { specificationHash } = yield callCaller({
    context: COLONY_CONTEXT,
    identifier: colonyENSName,
    methodName: 'getTask',
    params: { taskId },
  });
  // TODO: this should be done via gas station once `signMessage` is supported
  return yield call([wallet, wallet.signMessage], {
    message: specificationHash,
  });
}

function* generateRatingSecret(
  colonyENSName: ENSName,
  salt: string,
  rating: number,
) {
  return yield callCaller({
    context: COLONY_CONTEXT,
    identifier: colonyENSName,
    methodName: 'generateSecret',
    params: { salt, rating },
  });
}

function* generateRatingSaltAndSecret(
  colonyENSName: ENSName,
  taskId: number,
  rating: number,
) {
  const salt = yield call(generateRatingSalt, colonyENSName, taskId);
  return yield call(generateRatingSecret, colonyENSName, salt, rating);
}

/*
 * Given the salt for a published rating secret, determine the rating which was
 * used to generate it. If none match the published secret, throw.
 */
function* guessRating(
  colonyENSName: ENSName,
  taskId: string,
  role: string,
  salt: string,
) {
  const publishedSecret = yield callCaller({
    context: COLONY_CONTEXT,
    identifier: colonyENSName,
    methodName: 'getTaskWorkRatingSecret',
    params: { taskId, role },
  });
  let correctRating;
  let ratingGuess = 1;
  let currentSecret;
  while (!correctRating && ratingGuess <= 3) {
    currentSecret = yield call(
      generateRatingSecret,
      colonyENSName,
      salt,
      ratingGuess,
    );
    if (currentSecret === publishedSecret) correctRating = ratingGuess;
    ratingGuess += 1;
  }
  if (!correctRating) throw new Error('Rating is not from this account');
  return correctRating;
}

function* taskSetSkillSaga({
  payload: { taskId, skillId, colonyENSName },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  yield put(
    setTaskSkillTx({
      identifier: colonyENSName,
      params: { taskId, skillId },
      meta,
    }),
  );
}

function* taskSetDueDateSaga({
  payload: { dueDate, taskId },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  yield put(
    setTaskDueDateTx({
      identifier: colonyENSName,
      params: { taskId, dueDate },
      meta,
    }),
  );
}

function* taskWorkerEndSaga({
  payload: { colonyENSName, taskId, workDescription, rating },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  const ipfsNode = yield getContext('ipfsNode');
  try {
    const deliverableHash = yield call(
      [ipfsNode, ipfsNode.addString],
      workDescription,
    );
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );
    yield put(
      submitTaskDeliverableAndRatingTx({
        identifier: colonyENSName,
        params: { taskId, deliverableHash, secret },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_END_ERROR, error);
  }
}

function* completeTaskSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    // complete task past due date
    yield put(
      completeTaskTx({
        identifier: colonyENSName,
        params: { taskId },
        meta,
      }),
    );
    yield raceError(TASK_MANAGER_COMPLETE_SUCCESS, TASK_MANAGER_COMPLETE_ERROR);

    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate worker
    yield put(
      submitWorkerRatingAsManagerTx({
        identifier: colonyENSName,
        params: { taskId, secret, role: 'WORKER' },
        meta,
      }),
    );
    yield raceError(
      TASK_MANAGER_RATE_WORKER_SUCCESS,
      TASK_MANAGER_RATE_WORKER_ERROR,
    );

    // if we got this far without a throw, success!
    yield put({ type: TASK_MANAGER_END_SUCCESS });
  } catch (error) {
    yield putError(TASK_MANAGER_END_ERROR, error);
  }
}

function* taskWorkerRateManagerSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate manager
    yield put(
      submitManagerRatingAsWorkerTx({
        identifier: colonyENSName,
        params: { taskId, secret, role: 'MANAGER' },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_RATE_MANAGER_ERROR, error);
  }
}

function* taskManagerRateWorkerSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate worker
    yield put(
      submitWorkerRatingAsManagerTx({
        identifier: colonyENSName,
        params: { taskId, secret, role: 'WORKER' },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_MANAGER_RATE_WORKER_ERROR, error);
  }
}

function* taskWorkerRevealRatingSaga({
  payload: { colonyENSName, taskId },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const salt = yield call(generateRatingSalt, colonyENSName, taskId);
    const rating = yield call(
      guessRating,
      colonyENSName,
      taskId,
      'WORKER', // submitted by worker
      salt,
    );
    yield put(
      revealTaskRatingAsWorkerTx({
        identifier: colonyENSName,
        params: {
          taskId,
          rating,
          salt,
          role: 'MANAGER',
        },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_REVEAL_MANAGER_RATING_ERROR, error);
  }
}

function* taskManagerRevealRatingSaga({
  payload: { colonyENSName, taskId },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const salt = yield call(generateRatingSalt, colonyENSName, taskId);
    const rating = yield call(
      guessRating,
      colonyENSName,
      taskId,
      'MANAGER', // submitted by manager
      salt,
    );
    yield put(
      revealTaskRatingAsManagerTx({
        identifier: colonyENSName,
        params: {
          taskId,
          rating,
          salt,
          role: 'WORKER',
        },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_MANAGER_REVEAL_WORKER_RATING_ERROR, error);
  }
}

function* taskWorkerClaimRewardSaga({
  payload: { colonyENSName, taskId, tokenAddresses },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  yield all(
    tokenAddresses.map(token =>
      put(
        claimPayoutAsWorkerTx({
          identifier: colonyENSName,
          params: {
            taskId,
            token,
            role: 'WORKER',
          },
          meta,
        }),
      ),
    ),
  );
}

function* finalizeTaskSaga({
  payload: { taskId, colonyENSName },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  yield put(
    finalizeTaskTx({ identifier: colonyENSName, params: { taskId }, meta }),
  );
}

export default function* tasksSagas(): any {
  yield takeEvery(TASK_CREATE, createTaskSaga);
  yield takeEvery(TASK_FETCH, fetchTaskSaga);
  yield takeEvery(TASK_FETCH_ALL, fetchAllTasksSaga);
  yield takeEvery(TASK_FINALIZE, finalizeTaskSaga);
  yield takeEvery(TASK_MANAGER_END, completeTaskSaga);
  yield takeEvery(TASK_MANAGER_RATE_WORKER, taskManagerRateWorkerSaga);
  yield takeEvery(TASK_REMOVE, removeTaskSaga);
  yield takeEvery(TASK_SET_DATE, taskSetDueDateSaga);
  yield takeEvery(TASK_SET_SKILL, taskSetSkillSaga);
  yield takeEvery(TASK_UPDATE, updateTaskSaga);
  yield takeEvery(TASK_WORKER_END, taskWorkerEndSaga);
  yield takeEvery(TASK_WORKER_RATE_MANAGER, taskWorkerRateManagerSaga);
  yield takeEvery(
    TASK_WORKER_REVEAL_MANAGER_RATING,
    taskWorkerRevealRatingSaga,
  );
  yield takeEvery(
    TASK_MANAGER_REVEAL_WORKER_RATING,
    taskManagerRevealRatingSaga,
  );
  yield takeEvery(TASK_WORKER_CLAIM_REWARD, taskWorkerClaimRewardSaga);
}
