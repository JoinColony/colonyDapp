/* @flow */
import { STORE_DATA_CLASS, INITIALIZE_DATA } from './constants';

import type { Action } from '../types';

export * from './constants';
export * from './userActions';

export const initializeData = (dispatch, rootRepo) =>
  new Promise(resolve =>
    dispatch({
      type: INITIALIZE_DATA,
      resolve,
      rootRepo,
    }),
  );

export function initialData(Data: {}): Action {
  return {
    type: STORE_DATA_CLASS,
    payload: { Data },
  };
}
