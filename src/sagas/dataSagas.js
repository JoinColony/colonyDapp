import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import { initialData, setUserProfileContent } from '../actions';

import {
  ADD_COMMENT_TO_TASK,
  ADD_DOMAIN_TO_COLONY,
  ADD_TASK_TO_DOMAIN,
  EDIT_COLONY,
  EDIT_DOMAIN,
  EDIT_TASK,
  FETCH_COMMENTS,
  INITIALIZE_DATA,
  JOIN_COLONY,
  LOAD_COLONY,
  LOAD_DOMAIN,
  RETURN_COLONY,
  RETURN_DOMAIN,
  SET_COLONY_CONTENT,
  SET_DOMAIN_CONTENT,
  SET_PROFILE_CONTENT,
  SET_TASK_CONTENT,
  UPDATE_COLONY,
  UPDATE_DOMAIN,
  UPDATE_TASK,
} from '../actions/actionConstants';

function* joinColony(action) {
  const { colonyId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  yield* call(dataAPI.joinColony, colonyId);

  yield put({
    type: SET_PROFILE_CONTENT,
    update: {
      value: colonyId,
      property: 'colonies',
    },
  });
}

function* addColonyDomain(action) {
  const { colonyId, domainId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  yield* call(dataAPI.addColonyDomain, colonyId, domainId);

  yield put({
    type: SET_COLONY_CONTENT,
    colonyId,
    update: { property: 'domains', value: domainId },
  });
}

function* addTaskToDomain(action) {
  const { domainId, task } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  yield* call(dataAPI.draftTask, domainId, task);

  yield put({
    type: SET_DOMAIN_CONTENT,
    domainId,
    update: { property: 'tasks', value: task },
  });
}

// TODO make this resemble the others
function* addCommentToTask(action) {
  const { domainId, taskId, comment } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const commentHash = yield* call(
    dataAPI.addComment,
    domainId,
    taskId,
    comment,
  );

  yield put({
    type: UPDATE_TASK,
    payload: action.payload,
  });
}

// TODO payload should be colony after Data class loads correctly
function* loadColony(action) {
  const { colonyId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const colony = yield* call(dataAPI.loadColony, colonyId);

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
  const dataAPI = yield select(state => state.data.Data);
  const colony = yield* call(dataAPI.updateColony, colonyId, update);

  yield put({
    type: UPDATE_COLONY,
    payload: action.payload,
  });
}

function* editDomain(action) {
  const { domainId, update } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const domain = yield* call(dataAPI.updateDomain, domainId, update);

  yield put({
    type: UPDATE_DOMAIN,
    payload: action.payload,
  });
}

function* editTask(action) {
  const { domainId, taskId, update } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const task = yield* call(dataAPI.updateTask, domainId, taskId, update);

  yield put({
    type: UPDATE_TASK,
    payload: action.payload,
  });
}

// TODO payload should be domain after Data class loads correctly
function* loadDomain(action) {
  const { domainId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const domain = yield* call(dataAPI.loadDomain, domainId);

  yield put({
    type: LOAD_DOMAIN,
    payload: {
      domainId,
      content: {
        id: domainId,
        members: ['geo'],
        name: 'biotech',
        pot: '1 MILLION dollars',
      },
    },
  });
}

function* fetchComments(action) {
  const { domainId, taskId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const comments = yield* call(dataAPI.getTaskComments, domainId, taskId);

  yield put({
    type: UPDATE_TASK,
    payload: {
      update: { property: 'comments', value: comments },
      ...action.payload,
    },
  });
}

function* initializeData(action) {
  const { resolve, rootRepo } = action;
  const data = yield call(Data.fromDefaultConfig, null, {
    ipfs: {
      swarm: ['/ip4/0.0.0.0/tcp/0'],
      repo: `${rootRepo}/ipfs`,
    },
    orbit: {
      repo: `${rootRepo}/orbit`,
    },
  });

  yield call(data.ready);
  yield call(resolve, 'data API started and stored in Redux');

  yield put(initialData(data));
}

function* colonySagas() {
  yield takeEvery(INITIALIZE_DATA, initializeData);
  yield takeEvery(JOIN_COLONY, joinColony);
  yield takeEvery(ADD_DOMAIN_TO_COLONY, addColonyDomain);
  yield takeEvery(ADD_TASK_TO_DOMAIN, addTaskToDomain);
  yield takeEvery(ADD_COMMENT_TO_TASK, addCommentToTask);
  yield takeEvery(RETURN_COLONY, loadColony);
  yield takeEvery(RETURN_DOMAIN, loadDomain);
  yield takeEvery(EDIT_COLONY, editColony);
  yield takeEvery(EDIT_DOMAIN, editDomain);
  yield takeEvery(EDIT_TASK, editTask);
  yield takeEvery(FETCH_COMMENTS, fetchComments);
}

export default colonySagas;
