/* @flow */

import type { Saga } from 'redux-saga';

import { all, put, takeEvery, call, getContext } from 'redux-saga/effects';

import type { Action, ENSName } from '~types';

import { putError, raceError, callCaller } from '~utils/saga/effects';

import { COLONY_CONTEXT } from '../../../lib/ColonyManager/constants';

import {
  TASK_SET_DATE,
  TASK_SET_SKILL,
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_ASSIGN_WORKER,
  TASK_ASSIGN_WORKER_ERROR,
  TASK_ASSIGN_WORKER_SUCCESS,
  TASK_MANAGER_RATE_WORKER,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_WORKER_RATE_MANAGER,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  TASK_WORKER_CLAIM_REWARD,
  TASK_FINALIZE,
} from '../actionTypes';

import {
  taskSetDate,
  taskSetSkill,
  taskFinalize,
  taskManagerComplete,
  taskManagerRateWorker,
  taskManagerRevealRating,
  taskWorkerClaimReward,
  taskWorkerEnd,
  taskWorkerRateManager,
  taskWorkerRevealRating,
} from '../actionCreators';

function* generateRatingSalt(colonyENSName: ENSName, taskId: number) {
  const wallet = yield getContext('wallet');
  const { specificationHash } = yield callCaller({
    context: COLONY_CONTEXT,
    identifier: colonyENSName,
    methodName: 'getTask',
    params: { taskId },
  });
  // TODO: this should be done via gas station once `signMessage` is supported
  const salt = yield call([wallet, wallet.signMessage], {
    message: specificationHash,
  });
  return salt;
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

/**
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
}: Action): Saga<void> {
  yield put(
    taskSetSkill({
      identifier: colonyENSName,
      params: { taskId, skillId },
      meta,
    }),
  );
}

function* taskSetDueDateSaga(action: Action): Saga<void> {
  const {
    payload: { taskId, dueDate, colonyENSName },
    meta,
  } = action;

  yield put(
    taskSetDate({
      identifier: colonyENSName,
      params: { taskId, dueDate },
      meta,
    }),
  );
}

function* taskAssignWorkerSaga({
  payload: { assignee, payouts, taskId },
  meta,
}: Action): Saga<void> {
  try {
    // eslint-disable-next-line no-console
    console.log(assignee, payouts, taskId);

    yield put({ type: TASK_ASSIGN_WORKER_SUCCESS });
  } catch (error) {
    yield putError(TASK_ASSIGN_WORKER_ERROR, error);
  }
}

function* taskWorkerEndSaga({
  payload: { colonyENSName, taskId, workDescription, rating },
  meta,
}: Action): Saga<void> {
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
      taskWorkerEnd({
        identifier: colonyENSName,
        params: { taskId, deliverableHash, secret },
        meta,
      }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_END_ERROR, error);
  }
}

function* taskManagerEndSaga({
  payload: { colonyENSName, taskId, rating },
  meta,
}: Action): Saga<void> {
  try {
    // complete task past due date
    yield put(
      taskManagerComplete({
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
      taskManagerRateWorker({
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
}: Action): Saga<void> {
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
      taskWorkerRateManager({
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
}: Action): Saga<void> {
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
      taskManagerRateWorker({
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
}: Action): Saga<void> {
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
      taskWorkerRevealRating({
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
}: Action): Saga<void> {
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
      taskManagerRevealRating({
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
}: Action): Saga<void> {
  yield all(
    tokenAddresses.map(token =>
      put(
        taskWorkerClaimReward({
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
}: Action): Saga<void> {
  yield put(
    taskFinalize({ identifier: colonyENSName, params: { taskId }, meta }),
  );
}

export default function* taskSagas(): any {
  yield takeEvery(TASK_SET_DATE, taskSetDueDateSaga);
  yield takeEvery(TASK_SET_SKILL, taskSetSkillSaga);
  yield takeEvery(TASK_WORKER_END, taskWorkerEndSaga);
  yield takeEvery(TASK_MANAGER_END, taskManagerEndSaga);
  yield takeEvery(TASK_ASSIGN_WORKER, taskAssignWorkerSaga);
  yield takeEvery(TASK_WORKER_RATE_MANAGER, taskWorkerRateManagerSaga);
  yield takeEvery(TASK_MANAGER_RATE_WORKER, taskManagerRateWorkerSaga);
  yield takeEvery(
    TASK_WORKER_REVEAL_MANAGER_RATING,
    taskWorkerRevealRatingSaga,
  );
  yield takeEvery(
    TASK_MANAGER_REVEAL_WORKER_RATING,
    taskManagerRevealRatingSaga,
  );
  yield takeEvery(TASK_WORKER_CLAIM_REWARD, taskWorkerClaimRewardSaga);
  yield takeEvery(TASK_FINALIZE, taskFinalizeSaga);
}
