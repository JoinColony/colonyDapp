// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import Data from '../Data';

import {
  EDIT_PROFILE,
  INITIALIZE_DATA,
  LOAD_PROFILE,
  initialData,
  setUserProfileContent,
} from '../actions';

function* editProfile(action): Saga<void> {
  const { update: { profileKey, property, value } } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const result = yield call(
    dataAPI.editUserProfile,
    property,
    value,
    profileKey,
  );
  yield put(setUserProfileContent({ profileKey, property, value: result }));
}

function* getWholeProfile(action): Saga<void> {
  const { profileKey } = action.payload;
  const dataAPI = yield select(state => state.data.Data);
  const result = yield call(dataAPI.getUserProfileData, profileKey);
  yield put(
    setUserProfileContent({ profileKey, property: 'profile', value: result }),
  );
}

function* initializeData(action): Saga<void> {
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

export function* dataSagas(): Saga<void> {
  yield takeEvery(INITIALIZE_DATA, initializeData);
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(LOAD_PROFILE, getWholeProfile);
}
