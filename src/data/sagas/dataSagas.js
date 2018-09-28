import { call, put, select, takeEvery } from 'redux-saga/effects';
import Data from '../Data';

import {
  ADD_COMMENT_TO_TASK,
  ADD_DOMAIN_TO_COLONY,
  ADD_TASK_TO_DOMAIN,
  EDIT_COLONY,
  EDIT_DOMAIN,
  /* EDIT_PROFILE, */
  EDIT_TASK,
  FETCH_COMMENTS,
  INITIALIZE_DATA,
  JOIN_COLONY,
  LOAD_DOMAIN,
  FETCH_COLONY,
  RETURN_DOMAIN,
  SET_DOMAIN_CONTENT,
  UPDATE_DOMAIN,
  UPDATE_TASK,
  UPDATE_PROFILE,
  loadColony,
  updateColony,
  initialData,
  setUserProfileContent,
} from '../../actions';

function* addColonyDomain(action) {
  const { colonyId, domainId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  yield* call(dataAPI.addColonyDomain, colonyId, domainId);

  yield put(updateColony(colonyId, { property: 'domains', value: domainId }));
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
    update: action.payload,
  });
}

function* fetchColony(action) {
  const { colonyId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const colony = yield call(dataAPI.loadColony, colonyId);
  yield put(loadColony(colonyId, colony));
}

function* editColony(action) {
  const { colonyId, update } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const colony = yield* call(dataAPI.updateColony, colonyId, update);
  yield put(colonyId, update);
  /* yield put({
   *   type: UPDATE_COLONY,
   *   payload: action.payload,
   * });*/
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

function* joinColony(action) {
  const { colonyId } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const joinedColony = yield call(dataAPI.joinColony, colonyId);
  yield put(
    setUserProfileContent({ property: 'colonies', value: joinedColony }),
  );
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
  const init = initialData(data);
  yield put(init);
}

export function* dataSagas() {
  yield takeEvery(ADD_COMMENT_TO_TASK, addCommentToTask);
  yield takeEvery(ADD_DOMAIN_TO_COLONY, addColonyDomain);
  yield takeEvery(ADD_TASK_TO_DOMAIN, addTaskToDomain);
  yield takeEvery(EDIT_COLONY, editColony);
  yield takeEvery(EDIT_DOMAIN, editDomain);
  yield takeEvery(EDIT_TASK, editTask);
  yield takeEvery(FETCH_COMMENTS, fetchComments);
  yield takeEvery(INITIALIZE_DATA, initializeData);
  yield takeEvery(JOIN_COLONY, joinColony);
  yield takeEvery(FETCH_COLONY, fetchColony);
  yield takeEvery(RETURN_DOMAIN, loadDomain);
}
