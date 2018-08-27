import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import { initialData, setUserProfileContent } from '../actions';

import {
  SET_PROFILE_CONTENT,

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

  yield put({
    type: 'SET_PROFILE_CONTENT',
    content: 'whaat',
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
}

export default colonySagas;
