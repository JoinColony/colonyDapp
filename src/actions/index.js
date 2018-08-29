// @flow

import {
  INITIALIZE_DATA,
  SET_DATA_STATE,
  STATE_LOADING,
  STATE_READY,
} from './actionConstants';

import type { Action } from './actionConstants';

export * from './colonyActions';
export * from './domainActions';
export * from './userActions';
export * from './taskActions';

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

export function initialData(Data: {}): Action {
  return {
    type: INITIALIZE_DATA,
    Data,
  };
}

export function uploadFileToIPFS() {}
export function createWorkInvite() {}
export function createWorkRequest() {}
