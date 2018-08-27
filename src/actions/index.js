// @flow

import {
  INITIALIZE_DATA,
  JOIN_COLONY,
  SET_DATA_STATE,
  STATE_LOADING,
  SET_PROFILE_STATE,
  SET_PROFILE_CONTENT,
  STATE_READY,
} from './actionConstants';

import type { Action } from './actionConstants';

/* Setup */

export function loadState(): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_LOADING,
    data: null,
  };
}

export function dataReady(data: ?{}): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_READY,
    data,
  };
}

export function userProfileReady(data: ?{}): Action {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

export function initialData(Data: {}): Action {
  return {
    type: INITIALIZE_DATA,
    Data,
  };
}

/* User Actions */
export function setUserProfileContent(content: ?{}): Action {
  return {
    type: SET_PROFILE_CONTENT,
    payload: { content },
  };
}

export function addColonyToUserProfile(colonyId: string): Action {
  return {
    type: JOIN_COLONY,
    payload: { colonyId },
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
