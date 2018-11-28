/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery, call, getContext } from 'redux-saga/effects';

import type { Action } from '~types/index';

import { putError } from '~utils/saga/effects';
import { COLONY_CONTEXT } from '../../../lib/ColonyManager/constants';

import { TASK_SUBMIT_WORK, TASK_SUBMIT_WORK_ERROR } from '../actionTypes';

import { taskSubmitWork } from '../actionCreators';

function* taskSubmitWorkSaga(action: Action): Saga<void> {
  const {
    payload: { colonyIdentifier, taskId, workDescription, rating },
  } = action;
  const colonyManager = yield getContext('colonyManager');
  const wallet = yield getContext('wallet');
  const ipfsNode = yield getContext('ipfsNode');
  try {
    const deliverableHash = yield call(
      [ipfsNode, ipfsNode.addString],
      workDescription,
    );
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
    yield put(
      taskSubmitWork(colonyIdentifier, { taskId, deliverableHash, secret }),
    );
  } catch (error) {
    yield putError(TASK_SUBMIT_WORK_ERROR, error);
  }
}

export default function* taskSagas(): any {
  yield takeEvery(TASK_SUBMIT_WORK, taskSubmitWorkSaga);
}
