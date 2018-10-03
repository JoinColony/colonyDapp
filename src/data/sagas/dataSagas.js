// @flow
import { call, put, select, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import Data from '../DataAPI';
import dataContext from '~context/dataAPI';

import {
  EDIT_PROFILE,
  INITIALIZE_DATA,
  LOAD_PROFILE,
  initialData,
  setUserProfileContent,
  STARTED_RESPONSE,
} from '../actions';

function* editProfile(action): Saga<void> {
  const { update: { profileKey, property, value } } = action.payload;
  const dataAPI = dataContext.dataAPI;
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
  const dataAPI = dataContext.dataAPI;
  const result = yield call(dataAPI.getUserProfileData, profileKey);
  yield put(
    setUserProfileContent({ profileKey, property: 'profile', value: result }),
  );
}

function* initializeData(action): Saga<void> {
  const { resolve, rootRepo } = action;
  const dataAPI = yield call(Data.fromDefaultConfig, null, {
    ipfs: {
      swarm: ['/ip4/0.0.0.0/tcp/0'],
      repo: `${rootRepo}/ipfs`,
    },
    orbit: {
      repo: `${rootRepo}/orbit`,
    },
  });

  yield call(dataAPI.ready);
  yield call(resolve, STARTED_RESPONSE);

  yield call(dataContext.initializeData, dataAPI);
}

export function* dataSagas(): any {
  yield takeEvery(INITIALIZE_DATA, initializeData);
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(LOAD_PROFILE, getWholeProfile);
}
