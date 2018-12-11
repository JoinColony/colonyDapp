/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery, call, getContext } from 'redux-saga/effects';

import type { Action } from '~types';

import { putError, raceError, callCaller } from '~utils/saga/effects';

import {
  TASK_CREATE,
  TASK_CREATE_ERROR,
  TASK_CREATE_SUCCESS,
  TASK_EDIT,
  TASK_EDIT_ERROR,
  TASK_EDIT_SUCCESS,
  TASK_CREATE_TRANSACTION_SENT,
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_WORKER,
  TASK_MANAGER_RATE_WORKER_ERROR,
  TASK_MANAGER_RATE_WORKER_SUCCESS,
  TASK_WORKER_RATE_MANAGER,
  TASK_WORKER_RATE_MANAGER_ERROR,
  TASK_WORKER_REVEAL_MANAGER_RATING,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  TASK_MANAGER_REVEAL_WORKER_RATING,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
} from '../actionTypes';

import {
  taskCreate,
  taskManagerComplete,
  taskManagerRateWorker,
  taskManagerRevealRating,
  taskWorkerEnd,
  taskWorkerRateManager,
  taskWorkerRevealRating,
} from '../actionCreators';

function* generateRatingSalt(colonyIdentifier: string, taskId: number) {
  const wallet = yield getContext('wallet');
  const { specificationHash } = yield callCaller({
    colonyIdentifier,
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
  colonyIdentifier: string,
  salt: string,
  rating: number,
) {
  return yield callCaller({
    colonyIdentifier,
    methodName: 'generateSecret',
    params: { salt, rating },
  });
}

function* generateRatingSaltAndSecret(
  colonyIdentifier: string,
  taskId: number,
  rating: number,
) {
  const salt = yield call(generateRatingSalt, colonyIdentifier, taskId);
  return yield call(generateRatingSecret, colonyIdentifier, salt, rating);
}

/**
 * Given the salt for a published rating secret, determine the rating which was
 * used to generate it. If none match the published secret, throw.
 */
function* guessRating(
  colonyIdentifier: string,
  taskId: string,
  role: string,
  salt: string,
) {
  const publishedSecret = yield callCaller({
    colonyIdentifier,
    methodName: 'getTaskWorkRatingSecret',
    params: { taskId, role },
  });
  let correctRating;
  let ratingGuess = 1;
  let currentSecret;
  while (!correctRating && ratingGuess <= 3) {
    currentSecret = yield call(
      generateRatingSecret,
      colonyIdentifier,
      salt,
      ratingGuess,
    );
    if (currentSecret === publishedSecret) correctRating = ratingGuess;
    ratingGuess += 1;
  }
  if (!correctRating) throw new Error('Rating is not from this account');
  return correctRating;
}

function* taskCreateSaga(action: Action): Saga<void> {
  // eslint-disable-next-line no-unused-vars
  const { colonyIdentifier, orbitDBPath } = action.payload;

  try {
    // TODO: actually fetch from DDB
    const taskFromDDB = {
      specificationHash: 'Qm...',
      domainId: 1,
      skillId: 1,
      dueDate: new Date('2019-01-01'),
    };

    yield put(taskCreate(colonyIdentifier, taskFromDDB));

    const {
      payload: { hash: txHash },
    } = yield raceError(TASK_CREATE_TRANSACTION_SENT, TASK_CREATE_ERROR);
    // eslint-disable-next-line no-console
    console.log(txHash); // TODO: put txHash in DDB

    const {
      payload: { taskId },
    } = yield raceError(TASK_CREATE_SUCCESS, TASK_CREATE_ERROR);
    // eslint-disable-next-line no-console
    console.log(taskId); // TODO: put taskId in DDB
  } catch (error) {
    yield putError(TASK_CREATE_ERROR, error);
  }
}

function* taskEditSaga(action: Action): Saga<void> {
  const {
    colonyIdentifier,
    orbitDBPath,
    taskId,
    assignee,
    payouts,
  } = action.payload;

  try {
    // eslint-disable-next-line no-unused-vars
    let ddb;
    if (orbitDBPath) {
      // if exists in ddb, fetch it
      // TODO: fetch from ddb
    } else {
      // otherwise create it
      // TODO: create in ddb
    }

    if (taskId) {
      // if exists on chain

      if (assignee) {
        // update assignee on chain (with multisig)
        // TODO: send tx
      }

      if (payouts) {
        // update payouts on chain (with multisig)
        // TODO: send tx
      }
    } else {
      // if not on chain yet

      if (assignee) {
        // create on chain
        yield put({
          type: TASK_CREATE,
          payload: { colonyIdentifier, orbitDBPath },
        });
        yield raceError(TASK_CREATE_SUCCESS, TASK_CREATE_ERROR);
        // TODO: reload ddb
      }

      if (payouts) {
        // update draft payouts in ddb
        // TODO: update ddb
      }
    }

    yield put({ type: TASK_EDIT_SUCCESS });
  } catch (error) {
    yield putError(TASK_EDIT_ERROR, error);
  }
}

function* taskWorkerEndSaga(action: Action): Saga<void> {
  const {
    payload: { colonyIdentifier, taskId, workDescription, rating },
  } = action;
  const ipfsNode = yield getContext('ipfsNode');
  try {
    const deliverableHash = yield call(
      [ipfsNode, ipfsNode.addString],
      workDescription,
    );
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyIdentifier,
      taskId,
      rating,
    );
    yield put(
      taskWorkerEnd(colonyIdentifier, { taskId, deliverableHash, secret }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_END_ERROR, error);
  }
}

function* taskManagerEndSaga(action: Action): Saga<void> {
  const { colonyIdentifier, taskId, rating } = action.payload;
  try {
    // complete task past due date
    yield put(taskManagerComplete(colonyIdentifier, { taskId }));
    yield raceError(TASK_MANAGER_COMPLETE_SUCCESS, TASK_MANAGER_COMPLETE_ERROR);

    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyIdentifier,
      taskId,
      rating,
    );

    // rate worker
    yield put(taskManagerRateWorker(colonyIdentifier, { taskId, secret }));
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

function* taskWorkerRateManagerSaga(action: Action): Saga<void> {
  const { colonyIdentifier, taskId, rating } = action.payload;
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyIdentifier,
      taskId,
      rating,
    );

    // rate manager
    yield put(taskWorkerRateManager(colonyIdentifier, { taskId, secret }));
  } catch (error) {
    yield putError(TASK_WORKER_RATE_MANAGER_ERROR, error);
  }
}

function* taskManagerRateWorkerSaga(action: Action): Saga<void> {
  const { colonyIdentifier, taskId, rating } = action.payload;
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyIdentifier,
      taskId,
      rating,
    );

    // rate worker
    yield put(taskManagerRateWorker(colonyIdentifier, { taskId, secret }));
  } catch (error) {
    yield putError(TASK_MANAGER_RATE_WORKER_ERROR, error);
  }
}

function* taskWorkerRevealRatingSaga(action: Action): Saga<void> {
  const { colonyIdentifier, taskId } = action.payload;
  try {
    const salt = yield call(generateRatingSalt, colonyIdentifier, taskId);
    const rating = yield call(
      guessRating,
      colonyIdentifier,
      taskId,
      'WORKER', // submitted by worker
      salt,
    );
    yield put(
      taskWorkerRevealRating(colonyIdentifier, {
        taskId,
        rating,
        salt,
      }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_REVEAL_MANAGER_RATING_ERROR, error);
  }
}

function* taskManagerRevealRatingSaga(action: Action): Saga<void> {
  const { colonyIdentifier, taskId } = action.payload;
  try {
    const salt = yield call(generateRatingSalt, colonyIdentifier, taskId);
    const rating = yield call(
      guessRating,
      colonyIdentifier,
      taskId,
      'MANAGER', // submitted by manager
      salt,
    );
    yield put(
      taskManagerRevealRating(colonyIdentifier, {
        taskId,
        rating,
        salt,
      }),
    );
  } catch (error) {
    yield putError(TASK_MANAGER_REVEAL_WORKER_RATING_ERROR, error);
  }
}

export default function* taskSagas(): any {
  yield takeEvery(TASK_CREATE, taskCreateSaga);
  yield takeEvery(TASK_EDIT, taskEditSaga);
  yield takeEvery(TASK_WORKER_END, taskWorkerEndSaga);
  yield takeEvery(TASK_MANAGER_END, taskManagerEndSaga);
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
}
