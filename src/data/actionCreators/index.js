/* @flow */

import { INITIALIZE_DATA } from '../actionTypes';

export * from './userActions';

export const initializeData = (dispatch, rootRepo) =>
  new Promise(resolve =>
    dispatch({
      type: INITIALIZE_DATA,
      resolve,
      rootRepo,
    }),
  );
