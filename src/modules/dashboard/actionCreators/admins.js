/* @flow */

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

import {
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ADMIN_REMOVE_ERROR,
} from '../actionTypes';

export const addColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'setAdminRole',
  lifecycle: {
    error: COLONY_ADMIN_ADD_ERROR,
  },
});

export const removeColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'removeAdminRole',
  lifecycle: {
    error: COLONY_ADMIN_REMOVE_ERROR,
  },
});
