/* @flow */

import type { Saga } from 'redux-saga';
import type { ENSName } from '~types';
import type { ActionsType, Action } from '~redux';

import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';

import {
  callCaller,
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { updateTask } from '../../../data/service/commands';
import { getColonyTasks, getTask } from '../../../data/service/queries';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import {
  transactionAddParams,
  transactionReady,
} from '../../core/actionCreators';

import { allColonyENSNames } from '../selectors';

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
  // @FIXME: we could fetch it via draftId as well, if we have a map on state for draftId => store address
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

/*
 * Given a colony ENS name, dispatch actions to fetch all tasks
 * for that colony.
 */
// eslint-disable-next-line no-unused-vars
function* fetchAllTasksForColony(colonyENSName: ENSName): Saga<void> {
  const context = yield* getStoreContext(colonyENSName);
  yield* executeQuery(context, getColonyTasks);
  /*
   * TODO after https://github.com/JoinColony/colonyDapp/pull/815
   * 1. Get the colony store
   * 2. Get the task IDs/stores from the store
   * 3. With each task store, fetch the task
   * 3. Dispatch a success action for each (or all?) fetched tasks
   */
}

/*
 * Given all colonies in the current state, fetch all tasks for all
 * colonies (in parallel).
 */
function* taskFetchAll(): Saga<void> {
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
function* taskRemove({
  // meta: {
  // keyPath: [colonyENSName],
  // },
  meta,
}: Action<typeof ACTIONS.TASK_REMOVE>): Saga<void> {
  try {
    // const context = yield* getStoreContext(colonyENSName);

    // TODO add event after https://github.com/JoinColony/colonyDapp/pull/815

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_REMOVE_SUCCESS>>({
      type: ACTIONS.TASK_REMOVE_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_REMOVE_ERROR, error, meta);
  }
}

function* generateRatingSalt(colonyENSName: ENSName, taskId: number) {
  const wallet = yield* getContext(CONTEXT.WALLET);
  const { description } = yield callCaller({
    context: COLONY_CONTEXT,
    identifier: colonyENSName,
    methodName: 'getTask',
    params: { taskId },
  });
  // TODO: this should be done via gas station once `signMessage` is supported
  return yield call([wallet, wallet.signMessage], {
    message: description,
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
  taskId: number,
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

/**
 * As worker or manager, I want to be able to set a skill
 */
function* taskSetSkill({
  payload: { taskId, skillId },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setTaskSkill',
      identifier: colonyENSName,
      params: { taskId, skillId },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_SET_SKILL_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_SKILL_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As worker or manager, I want to be able to set a date
 */
function* taskSetDueDate({
  payload: { colonyENSName, dueDate, taskId },
  meta,
}: Action<typeof ACTIONS.TASK_SET_DATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setTaskDueDate',
      identifier: colonyENSName,
      params: { taskId, dueDate },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_SET_DATE_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As worker, submit work (`completeTask` group)
 */
function* taskSubmitDeliverable({
  payload: { colonyENSName, taskId, deliverableHash },
  meta,
}: Action<typeof ACTIONS.TASK_SUBMIT_DELIVERABLE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'submitTaskDeliverable',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 0,
      },
      identifier: colonyENSName,
      params: { taskId, deliverableHash },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_SUBMIT_DELIVERABLE_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_SUBMIT_DELIVERABLE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As worker, submit work and rate before due date (`completeTask` group)
 * Alternative to submitTaskDeliverable
 */
function* taskWorkerEnd({
  payload: { colonyENSName, taskId, workDescription, rating },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_END>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
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

    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'submitTaskDeliverableAndRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 0,
      },
      identifier: colonyENSName,
      params: { taskId, deliverableHash, secret },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_WORKER_END_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_END_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As manager, end the task if the due date has elapsed (`completeTask` group)
 * As manager, rate the worker (`completeTask` group)
 */
function* taskManagerEnd({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_MANAGER_END>): Saga<void> {
  const completeTaskId = `${meta.id}-completeTask`;
  const submitRatingId = `${meta.id}-submitRating`;
  const completeTaskChannel = yield call(getTxChannel, completeTaskId);
  const submitRatingChannel = yield call(getTxChannel, submitRatingId);

  try {
    // complete task past due date
    yield fork(createTransaction, completeTaskId, {
      context: COLONY_CONTEXT,
      methodName: 'completeTask',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 1,
      },
      identifier: colonyENSName,
      params: { taskId },
    });

    // rate worker
    yield fork(createTransaction, submitRatingId, {
      context: COLONY_CONTEXT,
      methodName: 'submitTaskWorkRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 2,
      },
      identifier: colonyENSName,
      params: { taskId, role: 'WORKER' },
      ready: false,
    });

    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    yield put(transactionAddParams(submitRatingId, { secret }));
    yield put(transactionReady(submitRatingId));

    yield takeFrom(completeTaskChannel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(submitRatingChannel, ACTIONS.TRANSACTION_CREATED);

    // Transactions are created, let the user and the gas station figure out the rest
    yield put({ type: ACTIONS.TASK_MANAGER_END_SUCCESS, meta });

    // Wait until both transactions are succeeded (to enable error catching)
    yield takeFrom(completeTaskChannel, ACTIONS.TRANSACTION_SUCCEEDED);
    yield takeFrom(submitRatingChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_MANAGER_END_ERROR, error, meta);
  } finally {
    completeTaskChannel.close();
    submitRatingChannel.close();
  }
}

/**
 * As worker, rate the manager (`completeTask` group)
 */
function* taskWorkerRateManager({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_RATE_MANAGER>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate manager
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'submitTaskWorkRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 2,
      },
      identifier: colonyENSName,
      params: { taskId, secret, role: 'MANAGER' },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* taskManagerRateWorker({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_MANAGER_RATE_WORKER>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate worker
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'submitTaskWorkRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 2,
      },
      identifier: colonyENSName,
      params: { taskId, secret, role: 'WORKER' },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As worker, reveal manager rating (`completeTask` group)
 */
function* taskWorkerRevealManagerRating({
  payload: { colonyENSName, taskId },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const salt = yield call(generateRatingSalt, colonyENSName, taskId);
    const rating = yield call(
      guessRating,
      colonyENSName,
      taskId,
      'WORKER', // submitted by worker
      salt,
    );

    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'revealTaskWorkRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 3,
      },
      identifier: colonyENSName,
      params: { taskId, rating, salt, role: 'MANAGER' },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(
      ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

/**
 * As manager, reveal worker rating (`completeTask` group)
 */
function* taskManagerRevealWorkerRating({
  payload: { colonyENSName, taskId },
  meta,
}: $PropertyType<
  ActionsType,
  'TASK_MANAGER_REVEAL_WORKER_RATING',
>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const salt = yield call(generateRatingSalt, colonyENSName, taskId);
    const rating = yield call(
      guessRating,
      colonyENSName,
      taskId,
      'MANAGER', // submitted by manager
      salt,
    );

    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'revealTaskWorkRating',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 3,
      },
      identifier: colonyENSName,
      params: { taskId, rating, salt, role: 'WORKER' },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(
      ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

/**
 * As anyone, finalize task (`completeTask` group)
 */
function* taskFinalize({
  payload: { taskId, colonyENSName },
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'finalizeTask',
      group: {
        key: 'completeTask',
        id: ['identifier', 'params.taskId'],
        index: 4,
      },
      identifier: colonyENSName,
      params: { taskId },
    });

    const { payload } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);
    yield put({
      type: ACTIONS.TASK_SET_DATE_SUCCESS,
      payload,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.TASK_SET_DATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

/**
 * As the worker, claim payout (`completeTask` group)
 */
function* taskWorkerClaimReward({
  payload: { colonyENSName, taskId, tokenAddresses },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_CLAIM_REWARD>): Saga<void> {
  const txChannels = yield all(
    tokenAddresses.map(token => call(getTxChannel, `${meta.id}-${token}`)),
  );

  try {
    yield all(
      tokenAddresses.map((token, idx) =>
        fork(createTransaction, `${meta.id}-${token}`, {
          context: COLONY_CONTEXT,
          methodName: 'claimPayout',
          group: {
            key: 'completeTask',
            id: ['identifier', 'params.taskId'],
            index: 5 + idx,
          },
          identifier: colonyENSName,
          params: { taskId, token, role: 'WORKER' },
        }),
      ),
    );

    // Wait for all the transactions to succeed
    const actions = yield all(
      tokenAddresses.map((token, idx) =>
        takeFrom(txChannels[idx], ACTIONS.TRANSACTION_SUCCEEDED),
      ),
    );

    yield put({
      type: ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS,
      payload: actions,
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR, error, meta);
  } finally {
    txChannels.forEach(channel => channel.close());
  }
}

export default function* tasksSagas(): Saga<void> {
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetch);
  yield takeEvery(ACTIONS.TASK_FETCH_ALL, taskFetchAll);
  yield takeEvery(ACTIONS.TASK_MANAGER_END, taskManagerEnd);
  yield takeEvery(ACTIONS.TASK_MANAGER_RATE_WORKER, taskManagerRateWorker);
  yield takeEvery(ACTIONS.TASK_REMOVE, taskRemove);
  yield takeEvery(ACTIONS.TASK_SET_DATE, taskSetDueDate);
  yield takeEvery(ACTIONS.TASK_SET_SKILL, taskSetSkill);
  yield takeEvery(ACTIONS.TASK_UPDATE, taskUpdate);
  yield takeEvery(ACTIONS.TASK_SUBMIT_DELIVERABLE, taskSubmitDeliverable);
  yield takeEvery(ACTIONS.TASK_WORKER_END, taskWorkerEnd);
  yield takeEvery(ACTIONS.TASK_WORKER_RATE_MANAGER, taskWorkerRateManager);
  yield takeEvery(
    ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING,
    taskWorkerRevealManagerRating,
  );
  yield takeEvery(
    ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING,
    taskManagerRevealWorkerRating,
  );
  yield takeEvery(ACTIONS.TASK_FINALIZE, taskFinalize);
  yield takeEvery(ACTIONS.TASK_WORKER_CLAIM_REWARD, taskWorkerClaimReward);
}
