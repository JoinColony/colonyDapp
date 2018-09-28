/* @flow */
import {
  SET_DATA_STATE,
  STATE_LOADING,
  STATE_READY,
  STORE_DATA_CLASS,
  INITIALIZE_DATA,
} from './constants';

import type { Action } from './actionConstants';

export * from './constants';
export * from './actionConstants';
export * from './createColony';
export * from './colonyActions';
export * from './domainActions';
export * from './userActions';
export * from './taskActions';

export const initializeData = (dispatch, rootRepo) =>
  new Promise((resolve, reject) =>
    dispatch({
      type: 'INITIALIZE_DATA',
      resolve,
      rootRepo,
    }),
  );

export function initialData(Data: {}): Action {
  return {
    type: STORE_DATA_CLASS,
    Data,
  };
}
