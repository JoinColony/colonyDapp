import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import { initialData, setUserProfileContent } from '../actions';

import {
  ADD_COMMENT_TO_TASK,
  ADD_DOMAIN_TO_COLONY,
  ADD_TASK_TO_DOMAIN,
  LOAD_COLONY,
  RETURN_COLONY,
  EDIT_COLONY,
  UPDATE_COLONY,
  LOAD_DOMAIN,
  RETURN_DOMAIN,
  JOIN_COLONY,
  SET_COLONY_CONTENT,
  SET_DOMAIN_CONTENT,
  SET_PROFILE_CONTENT,
  SET_TASK_CONTENT,
} from '../actions/actionConstants';

function* joinColony(action) {
  const { colonyId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.joinColony(colonyId);

  yield put({
    type: SET_PROFILE_CONTENT,
    payload: {
      content: [colonyId],
      target: 'colonies',
    },
  });
}

function* addColonyDomain(action) {
  const { colonyId, domainId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.addColonyDomain(colonyId, domainId);

  yield put({
    type: SET_COLONY_CONTENT,
    payload: {
      content: { domains: [domainId] },
      target: colonyId,
    },
  });
}

function* addTaskToDomain(action) {
  const { domainId, task } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.draftTask(domainId, task);

  yield put({
    type: SET_DOMAIN_CONTENT,
    payload: {
      content: { tasks: [task] },
      target: domainId,
    },
  });
}

// TODO make this resemble the others
function* addCommentToTask(action) {
  const { domainId, taskId, comment } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.addComment(domainId, taskId, comment);

  yield put({
    type: SET_TASK_CONTENT,
    payload: {
      content: [comment],
      target: [domainId, taskId],
    },
  });
}

// TODO payload should be colony after Data class loads correctly
function* loadColony(action) {
  const { colonyId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // const colony = yield Data.loadColony(colonyId);

  yield put({
    type: LOAD_COLONY,
    payload: {
      content: {
        id: colonyId,
        members: ['geo'],
        domain: 'biotech',
        pot: '1 MILLION dollars',
      },
      target: colonyId,
    },
  });
}

function* editColony(action) {
  const { colonyId, update } = action.payload;
  const Data = yield select(state => state.data.Data);
  // const colony = yield Data.updateColony(colonyId, update);

  yield put({
    type: UPDATE_COLONY,
    payload: action.payload,
  });
}

// TODO payload should be domain after Data class loads correctly
function* loadDomain(action) {
  const { domainId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // const domain = yield Data.loadDomain(domainId);

  yield put({
    type: LOAD_DOMAIN,
    payload: {
      content: {
        id: domainId,
        members: ['geo'],
        name: 'biotech',
        pot: '1 MILLION dollars',
      },
      target: domainId,
    },
  });
}

function* initializeData() {
  const data = yield Data.fromDefaultConfig('no pinner', {
    ipfs: {
      swarm: ['/ip4/0.0.0.0/tcp/0'],

      repo: `/tmp/tests/time/ipfs/ipfs`,
    },
    orbit: {
      repo: `/tmp/tests/time/ipfs/orbit`,
    },
  });
  // yield data.ready();
  const action = initialData(data);
  yield put(action);
}

function* colonySagas() {
  yield initializeData();
  yield takeEvery(JOIN_COLONY, joinColony);
  yield takeEvery(ADD_DOMAIN_TO_COLONY, addColonyDomain);
  yield takeEvery(ADD_TASK_TO_DOMAIN, addTaskToDomain);
  yield takeEvery(ADD_COMMENT_TO_TASK, addCommentToTask);
  yield takeEvery(RETURN_COLONY, loadColony);
  yield takeEvery(RETURN_DOMAIN, loadDomain);
  yield takeEvery(EDIT_COLONY, editColony);
}

export default colonySagas;
