// @flow
import { call, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import Data from '../DataAPI';
import dataContext from '../../context/dataAPI';

import { setEntireUserProfile, setUserProfileContent } from '../actionCreators';

import {
  EDIT_PROFILE,
  GET_PROFILE_PROPERTY,
  INITIALIZE_DATA,
  LOAD_PROFILE,
  STARTED_RESPONSE,
  SET_PROFILE,
} from '../actionTypes';

function* editProfile(action): Saga<void> {
  const { profileKey, property, value } = action.payload;
  const { dataAPI } = dataContext;
  const result = yield call(
    dataAPI.editUserProfile,
    property,
    value,
    profileKey,
  );

  yield put(setUserProfileContent({ profileKey, property, value: result }));
}

function* setWholeProfile(action): Saga<void> {
  const { profileKey, value: properties } = action.payload;
  const { dataAPI } = dataContext;
  const result = yield call(dataAPI.setUserProfile, properties, profileKey);

  yield put(setEntireUserProfile({ profileKey, value: result }));
}

function* getWholeProfile(action): Saga<void> {
  const { profileKey } = action.payload;
  const { dataAPI } = dataContext;
  const result = yield call(dataAPI.getUserProfileData, profileKey);

  yield put(
    setUserProfileContent({ profileKey, property: 'profile', value: result }),
function* getProfileProperty(action): Saga<void> {
  const { profileKey, property } = action.payload;
  const { dataAPI } = dataContext;
  const result = yield call(
    dataAPI.getUserProfileProperty,
    profileKey,
    property,
  );
  yield put(setUserProfileContent({ profileKey, property, value: result }));
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

export default function* dataSagas(): any {
  yield takeEvery(INITIALIZE_DATA, initializeData);
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(SET_PROFILE, setWholeProfile);
  yield takeEvery(LOAD_PROFILE, getWholeProfile);
  yield takeEvery(GET_PROFILE_PROPERTY, getProfileProperty);
}
