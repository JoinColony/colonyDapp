/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery, call, getContext } from 'redux-saga/effects';

import type { Action } from '~types/index';

import { putError, raceError } from '~utils/saga/effects';
import { COLONY_CONTEXT } from '../../../lib/ColonyManager/constants';

import {
  TASK_WORKER_END,
  TASK_WORKER_END_ERROR,
  TASK_MANAGER_END,
  TASK_MANAGER_END_ERROR,
  TASK_MANAGER_END_SUCCESS,
  TASK_MANAGER_COMPLETE_ERROR,
  TASK_MANAGER_COMPLETE_SUCCESS,
  TASK_MANAGER_RATE_ERROR,
  TASK_MANAGER_RATE_SUCCESS,
} from '../actionTypes';

import {
  taskWorkerEnd,
  taskManagerComplete,
  taskManagerRate,
} from '../actionCreators';

function* generateRatingSecret(
  colonyIdentifier: string,
  taskId: string,
  rating: string,
) {
  const colonyManager = yield getContext('colonyManager');
  const wallet = yield getContext('wallet');
  const getTask = yield call(
    [colonyManager, colonyManager.getMethod],
    COLONY_CONTEXT,
    'getTask',
    colonyIdentifier,
  );
  const generateSecret = yield call(
    [colonyManager, colonyManager.getMethod],
    COLONY_CONTEXT,
    'generateSecret',
    colonyIdentifier,
  );
  const { specificationHash } = yield call([getTask, getTask.call], {
    taskId,
  });
  const salt = yield call([wallet, wallet.signMessage], {
    message: specificationHash,
  });
  const secret = yield call([generateSecret, generateSecret.call], {
    salt,
    rating,
  });
  return secret;
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
      generateRatingSecret,
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
      generateRatingSecret,
      colonyIdentifier,
      taskId,
      rating,
    );

    // rate worker
    yield put(taskManagerRate(colonyIdentifier, { taskId, secret }));
    yield raceError(TASK_MANAGER_RATE_SUCCESS, TASK_MANAGER_RATE_ERROR);

    // if we got this far without a throw, success!
    yield put({ type: TASK_MANAGER_END_SUCCESS });
  } catch (error) {
    yield putError(TASK_MANAGER_END_ERROR, error);
  }
}

export default function* taskSagas(): any {
  yield takeEvery(TASK_WORKER_END, taskWorkerEndSaga);
  yield takeEvery(TASK_MANAGER_END, taskManagerEndSaga);
}
