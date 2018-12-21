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

import type { Action, ENSName } from '~types';

import { callCaller, putError, raceError } from '~utils/saga/effects';

import { DDB } from '../../../lib/database';
import { DocStore } from '../../../lib/database/stores';

import { colonyStore, domainStore, taskStore } from '../stores';
import { tasksStoreAddressSelector } from '../selectors';

import {
  DRAFT_DELETE,
  TASK_CREATE,
  TASK_CREATE_ERROR,
  TASK_CREATE_SUCCESS,
  TASK_FETCH_SUCCESS,
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
  TASK_WORKER_CLAIM_REWARD,
  TASK_FINALIZE,
} from '../actionTypes';

import {
  taskFinalize,
  taskCreate,
  taskManagerComplete,
  taskManagerRateWorker,
  taskManagerRevealRating,
  taskWorkerClaimReward,
  taskWorkerEnd,
  taskWorkerRateManager,
  taskWorkerRevealRating,
} from '../actionCreators';

import { fetchOrCreateDomainStore } from './domain';

export function* createTaskStore(): Saga<DocStore> {
  const ddb: DDB = yield getContext('ddb');
  const store = yield call([ddb, ddb.createStore], taskStore);
  return store;
}

export function* fetchTaskStore({
  colonyAddress = '',
  taskStoreAddress,
  domainName,
}: {
  colonyAddress?: string,
  taskStoreAddress?: string,
  domainName?: string,
}): Saga<DocStore> {
  const ddb: DDB = yield getContext('ddb');
  let store;
  if (taskStoreAddress) {
    store = yield call([ddb, ddb.getStore], taskStore, taskStoreAddress);
  } else {
    if (!colonyAddress.length)
      throw new Error('Provide an address to retrieve the task store');
    // get the colony
    const colony = yield call([ddb, ddb.getStore], colonyStore, colonyAddress);
    yield call([colony, colony.load]);
    // get the correct domain
    const domains = yield call([colony, colony.get], 'domains');
    const domain = yield call(
      [ddb, ddb.getStore],
      domainStore,
      domains[domainName],
    );
    yield call([domain, domain.load]);
    // get the tasks database
    const tasksAddress = yield call([domain, domain.get], 'tasksDatabase');
    store = yield call([ddb, ddb.getStore], taskStore, tasksAddress);
  }
  yield call([store, store.load]);
  return store;
}

function* generateRatingSalt(colonyENSName: ENSName, taskId: number) {
  const wallet = yield getContext('wallet');
  const { specificationHash } = yield callCaller({
    colonyENSName,
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
    colonyENSName,
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
    colonyENSName,
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

function* createTaskSaga(action: Action): Saga<void> {
  const { colonyENSName, domainName, task } = action.payload;

  try {
    // put task on chain
    yield put(taskCreate(colonyENSName, task));
    yield raceError(
      ({ type, payload: { id } }) =>
        type === TASK_CREATE_TRANSACTION_SENT && id === task.id,
      ({ type, payload: { id } }) =>
        type === TASK_CREATE_ERROR && id === task.id,
    );

    yield raceError(TASK_CREATE_TRANSACTION_SENT, TASK_CREATE_ERROR);
    const newTask = yield raceError(
      ({ type, payload: { taskId: id } }) =>
        type === TASK_CREATE_SUCCESS && id === task.id,
      ({ type, payload: { taskId: id } }) =>
        type === TASK_CREATE_ERROR && id === task.id,
    );
    // remove task from drafts
    const rootDomain = yield call(fetchOrCreateDomainStore, {
      colonyAddress: colonyENSName,
      domainName: 'rootDomain',
    });
    const taskStoreAddress = yield select(
      tasksStoreAddressSelector,
      rootDomain.address.toString(),
    );
    yield put({
      type: DRAFT_DELETE,
      payload: {
        colonyENSName,
        domainAddress: rootDomain.address.toString(),
        taskStoreAddress,
        taskId: task.id,
      },
    });

    // put task into destination domain taskStore
    const tasks = yield call(fetchTaskStore, { domainName });
    yield call([tasks, tasks.add], task);
    const taskFromDDB = yield call([tasks, tasks.get], task.id);

    // put task into state
    yield put({
      type: TASK_FETCH_SUCCESS,
      payload: {
        ensName: colonyENSName,
        tasksId: tasks.address.toString(),
        task: { id: newTask.payload.taskId, ...taskFromDDB },
      },
    });
  } catch (error) {
    yield putError(TASK_CREATE_ERROR, error);
  }
}

function* editTaskSaga(action: Action): Saga<void> {
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
    payload: { colonyENSName, taskId, workDescription, rating },
  } = action;
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
      taskWorkerEnd(colonyENSName, { taskId, deliverableHash, secret }),
    );
  } catch (error) {
    yield putError(TASK_WORKER_END_ERROR, error);
  }
}

function* taskManagerEndSaga(action: Action): Saga<void> {
  const { colonyENSName, taskId, rating } = action.payload;
  try {
    // complete task past due date
    yield put(taskManagerComplete(colonyENSName, { taskId }));
    yield raceError(TASK_MANAGER_COMPLETE_SUCCESS, TASK_MANAGER_COMPLETE_ERROR);

    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate worker
    yield put(taskManagerRateWorker(colonyENSName, { taskId, secret }));
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
  const { colonyENSName, taskId, rating } = action.payload;
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate manager
    yield put(taskWorkerRateManager(colonyENSName, { taskId, secret }));
  } catch (error) {
    yield putError(TASK_WORKER_RATE_MANAGER_ERROR, error);
  }
}

function* taskManagerRateWorkerSaga(action: Action): Saga<void> {
  const { colonyENSName, taskId, rating } = action.payload;
  try {
    // generate secret
    const secret = yield call(
      generateRatingSaltAndSecret,
      colonyENSName,
      taskId,
      rating,
    );

    // rate worker
    yield put(taskManagerRateWorker(colonyENSName, { taskId, secret }));
  } catch (error) {
    yield putError(TASK_MANAGER_RATE_WORKER_ERROR, error);
  }
}

function* taskWorkerRevealRatingSaga(action: Action): Saga<void> {
  const { colonyENSName, taskId } = action.payload;
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
      taskWorkerRevealRating(colonyENSName, {
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
  const { colonyENSName, taskId } = action.payload;
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
      taskManagerRevealRating(colonyENSName, {
        taskId,
        rating,
        salt,
      }),
    );
  } catch (error) {
    yield putError(TASK_MANAGER_REVEAL_WORKER_RATING_ERROR, error);
  }
}

function* taskWorkerClaimRewardSaga(action: Action): Saga<void> {
  const { colonyENSName, taskId, tokenAddresses } = action.payload;
  yield all(
    tokenAddresses.map(token =>
      put(
        taskWorkerClaimReward(colonyENSName, {
          taskId,
          token,
        }),
      ),
    ),
  );
}

function* finalizeTaskSaga(action: Action): Saga<void> {
  const { taskId, colonyENSName } = action.payload;

  yield put(taskFinalize(colonyENSName, { taskId }));
}

export default function* taskSagas(): any {
  yield takeEvery(TASK_CREATE, createTaskSaga);
  yield takeEvery(TASK_EDIT, editTaskSaga);
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
  yield takeEvery(TASK_WORKER_CLAIM_REWARD, taskWorkerClaimRewardSaga);
  yield takeEvery(TASK_FINALIZE, finalizeTaskSaga);
}
