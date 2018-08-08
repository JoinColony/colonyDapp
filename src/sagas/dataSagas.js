import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import DDBTestFactory from '../../integration-testing/utils/DDBTestFactory';

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
  const factory = new DDBTestFactory('DataSaga.test');
  yield factory.pinner();
  const Data = yield factory.Data('data');
  yield factory.ready();
  const action = actionInitializeData(Data);
  yield put(action);
}

function* colonySagas() {
  yield initializeData();
  yield takeEvery(JOIN_COLONY, joinColony);
}

export default colonySagas;
