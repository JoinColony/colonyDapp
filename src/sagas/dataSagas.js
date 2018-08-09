import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import {
  actionInitializeData,
  actionSetUserProfileContent,
} from '../reducers/dataReducer.js';
const JOIN_COLONY = 'JOIN_COLONY';

function* joinColony(action) {
  const { colonyId } = action.payload;
  const Data = select(state => state.Data);
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
