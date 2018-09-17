// @flow

import {
  INITIALIZE_DATA,
  SET_DATA_STATE,
  STATE_LOADING,
  STATE_READY,
  STORE_DATA_CLASS,
  INITIALIZE_DATA,
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
    type: STORE_DATA_CLASS,
    Data,
  };
}

/* export const initializeData = () => ({ type: INITIALIZE_DATA });*/
export const initializeData = dispatch =>
  new Promise((resolve, reject) =>
    dispatch({
      type: 'INITIALIZE_DATA',
      resolve,
      reject,
    }),
  );

export function uploadFileToIPFS() {}
export function createWorkInvite() {}
export function createWorkRequest() {}
