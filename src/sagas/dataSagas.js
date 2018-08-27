import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import {
  actionInitializeData,
  actionSetUserProfileContent,
} from '../reducers/dataReducer.js';
const JOIN_COLONY = 'JOIN_COLONY';
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
  const data = yield Data.fromDefaultConfig();
  const action = actionInitializeData(data);
  yield put(action);
}

function* colonySagas() {
  yield initializeData();
  yield takeEvery(JOIN_COLONY, joinColony);
}

export default colonySagas;
