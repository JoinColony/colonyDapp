// @flow

import {
  SET_DATA_STATE,
  SET_PROFILE_STATE,
  SET_PROFILE_CONTENT,
  STATE_LOADING,
  STATE_READY,
  JOIN_COLONY,
  INITIALIZE_DATA,
} from './actionConstants';

import type { Action } from './actionConstants';

export function actionLoadState(): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_LOADING,
    data: null,
  };
}

export function actionDataReady(data: ?{}): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_READY,
    data,
  };
}

export function actionUserProfileReady(data: ?{}): Action {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

export function actionSetUserProfileContent(content: ?{}): Action {
  return {
    type: SET_PROFILE_CONTENT,
    content,
  };
}

export function actionAddColonyToUserProfile(colonyID: string): Action {
  return {
    type: JOIN_COLONY,
    payload: { colonyID },
  };
}

export function actionInitializeData(Data: {}): Action {
  return {
    type: INITIALIZE_DATA,
    Data,
  };
}

let actionJoinColony;
let actionJoinDomain;
let actionAddDomain;
let action;
