/* @flow */

import type { Saga } from 'redux-saga';

import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import type { ENSName } from '~types';

import { putError, raceError, callCaller } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { COLONY_CONTEXT } from '../../../lib/ColonyManager/constants';

import { createBatchTxRunner } from '../../core/sagas/transactions';

import {
  claimPayoutAsWorkerTx,
  completeTaskTx,
  finalizeTaskTx,
  revealTaskRatingAsManagerTx,
  revealTaskRatingAsWorkerTx,
  setTaskDueDateTx,
  setTaskSkillTx,
  submitManagerRatingAsWorkerTx,
  submitTaskDeliverableAndRatingTx,
  submitWorkerRatingAsManagerTx,
  taskCreateBatch,
  taskMoveFundsBatch,
  taskSetWorkerPayoutBatch,
  taskSetWorkerRoleBatch,
} from '../actionCreators';
import { allColonyENSNames } from '../selectors';
import { ensureColonyIsInState } from './shared';
import type { ActionsType, Action } from '~redux';

const createTaskBatch = createBatchTxRunner({
  meta: { key: 'transaction.batch.createTask' },
  transactions: [
    {
      actionCreator: taskCreateBatch,
    },
    {
      actionCreator: taskMoveFundsBatch,
      transferParams: ([{ eventData }]) => ({
        toPot: eventData && eventData.potId,
      }),
    },
    {
      actionCreator: taskSetWorkerPayoutBatch,
      transferParams: ([{ eventData }]) => ({
        taskId: eventData && eventData.taskId,
      }),
    },
    {
      actionCreator: taskSetWorkerRoleBatch,
      transferParams: ([{ eventData }]) => ({
        taskId: eventData && eventData.taskId,
      }),
    },
  ],
});

function* taskCreateSaga(
  action: Action<typeof ACTIONS.TASK_CREATE>,
): Saga<void> {
  const {
    meta,
    payload: {
      specificationHash,
      domainId,
      skillId,
      dueDate,
      fromPot,
      amount,
      token,
      user,
    },
  } = action;
  try {
    yield put<Action<typeof ACTIONS.TASK_CREATE_SUCCESS>>({
      type: ACTIONS.TASK_CREATE_SUCCESS,
      meta,
      payload: {},
    });
    yield call(createTaskBatch, action, [
      { params: { specificationHash, domainId, skillId, dueDate } },
      { params: { fromPot, amount, token } },
      { params: { token, amount } },
      { params: { user } },
    ]);
  } catch (error) {
    yield putError(ACTIONS.TASK_CREATE_ERROR, error, meta);
  }
}

const modifyWorkerPayoutBatch = createBatchTxRunner({
  meta: { key: 'transaction.batch.modifyWorkerPayout' },
  transactions: [
    {
      actionCreator: taskMoveFundsBatch,
    },
    {
      actionCreator: taskSetWorkerPayoutBatch,
    },
  ],
});

function* taskModifyWorkerPayoutSaga(
  action: Action<typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT>,
): Saga<void> {
  const {
    meta,
    payload: { taskId, fromPot, toPot, amount, token },
  } = action;
  try {
    yield put<Action<typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_SUCCESS>>({
      type: ACTIONS.TASK_MODIFY_WORKER_PAYOUT_SUCCESS,
      meta,
      payload: {},
    });
    yield call(modifyWorkerPayoutBatch, action, [
      { params: { fromPot, toPot, amount, token } },
      { params: { taskId, token, amount } },
    ]);
  } catch (error) {
    yield putError(ACTIONS.TASK_MODIFY_WORKER_PAYOUT_ERROR, error, meta);
  }
}

/*
 * Given a colony ENS name a task ID, fetch the task from its store.
 * Optionally, the `taskStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* taskFetchSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload,
}: Action<typeof ACTIONS.TASK_FETCH>): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    // TODO get the task store and fetch it, after https://github.com/JoinColony/colonyDapp/pull/815

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
 * Given a colony ENS name, dispatch actions to fetch all tasks
 * for that colony.
 */
// eslint-disable-next-line no-unused-vars
function* fetchAllTasksForColony(colonyENSName: ENSName): Saga<void> {
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
function* taskFetchAllSaga(): Saga<void> {
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
function* taskUpdateSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
  payload,
}: Action<typeof ACTIONS.TASK_UPDATE>): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    // TODO add update event after https://github.com/JoinColony/colonyDapp/pull/815

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
function* taskRemoveSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.TASK_REMOVE>): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    // TODO add event after https://github.com/JoinColony/colonyDapp/pull/815

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.TASK_REMOVE_SUCCESS>>({
      type: ACTIONS.TASK_REMOVE_SUCCESS,
      meta,
      payload: {},
    });
  } catch (error) {
    yield putError(ACTIONS.TASK_REMOVE_ERROR, error, meta);
  }
}

function* generateRatingSalt(colonyENSName: ENSName, taskId: number) {
  const wallet = yield* getContext(CONTEXT.WALLET);
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

function* taskSetSkillSaga({
  payload: { taskId, skillId, colonyENSName },
  meta,
}: Action<typeof ACTIONS.TASK_SET_SKILL>): Saga<void> {
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
}: Action<typeof ACTIONS.TASK_SET_DATE>): Saga<void> {
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
}: Action<typeof ACTIONS.TASK_WORKER_END>): Saga<void> {
  const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
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
    yield putError(ACTIONS.TASK_WORKER_END_ERROR, error);
  }
}

function* completeTaskSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_MANAGER_END>): Saga<void> {
  try {
    // complete task past due date
    yield put(
      completeTaskTx({
        identifier: colonyENSName,
        params: { taskId },
        meta,
      }),
    );
    yield raceError(
      ACTIONS.TASK_MANAGER_COMPLETE_SUCCESS,
      ACTIONS.TASK_MANAGER_COMPLETE_ERROR,
    );

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
      ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
      ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR,
    );

    // if we got this far without a throw, success!
    yield put({ type: ACTIONS.TASK_MANAGER_END_SUCCESS });
  } catch (error) {
    yield putError(ACTIONS.TASK_MANAGER_END_ERROR, error);
  }
}

function* taskWorkerRateManagerSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_RATE_MANAGER>): Saga<void> {
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
    yield putError(ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR, error);
  }
}

function* taskManagerRateWorkerSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action<typeof ACTIONS.TASK_MANAGER_RATE_WORKER>): Saga<void> {
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
    yield putError(ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR, error);
  }
}

function* taskWorkerRevealManagerRatingSaga({
  payload: { colonyENSName, taskId },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING>): Saga<void> {
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
    yield putError(ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR, error);
  }
}

function* taskManagerRevealWorkerRatingSaga({
  payload: { colonyENSName, taskId },
  meta,
}: $PropertyType<
  ActionsType,
  'TASK_MANAGER_REVEAL_WORKER_RATING',
>): Saga<void> {
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
    yield putError(ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR, error);
  }
}

function* taskWorkerClaimRewardSaga({
  payload: { colonyENSName, taskId, tokenAddresses },
  meta,
}: Action<typeof ACTIONS.TASK_WORKER_CLAIM_REWARD>): Saga<void> {
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

function* taskFinalizeSaga({
  payload: { taskId, colonyENSName },
  meta,
}: Action<typeof ACTIONS.TASK_FINALIZE>): Saga<void> {
  yield put(
    finalizeTaskTx({ identifier: colonyENSName, params: { taskId }, meta }),
  );
}

export default function* tasksSagas(): any {
  yield takeEvery(ACTIONS.TASK_CREATE, taskCreateSaga);
  yield takeEvery(
    ACTIONS.TASK_MODIFY_WORKER_PAYOUT,
    taskModifyWorkerPayoutSaga,
  );
  yield takeEvery(ACTIONS.TASK_FETCH, taskFetchSaga);
  yield takeEvery(ACTIONS.TASK_FETCH_ALL, taskFetchAllSaga);
  yield takeEvery(ACTIONS.TASK_FINALIZE, taskFinalizeSaga);
  yield takeEvery(ACTIONS.TASK_MANAGER_END, completeTaskSaga);
  yield takeEvery(ACTIONS.TASK_MANAGER_RATE_WORKER, taskManagerRateWorkerSaga);
  yield takeEvery(ACTIONS.TASK_REMOVE, taskRemoveSaga);
  yield takeEvery(ACTIONS.TASK_SET_DATE, taskSetDueDateSaga);
  yield takeEvery(ACTIONS.TASK_SET_SKILL, taskSetSkillSaga);
  yield takeEvery(ACTIONS.TASK_UPDATE, taskUpdateSaga);
  yield takeEvery(ACTIONS.TASK_WORKER_END, taskWorkerEndSaga);
  yield takeEvery(ACTIONS.TASK_WORKER_RATE_MANAGER, taskWorkerRateManagerSaga);
  yield takeEvery(
    ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING,
    taskWorkerRevealManagerRatingSaga,
  );
  yield takeEvery(
    ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING,
    taskManagerRevealWorkerRatingSaga,
  );
  yield takeEvery(ACTIONS.TASK_WORKER_CLAIM_REWARD, taskWorkerClaimRewardSaga);
}
