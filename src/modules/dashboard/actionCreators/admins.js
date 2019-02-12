/* @flow */

import { ACTIONS } from '~redux';

import {
  createTxActionCreator,
  COLONY_CONTEXT,
} from '../../core/actionCreators';

export const addColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'setAdminRole',
  lifecycle: {
    error: ACTIONS.COLONY_ADMIN_ADD_ERROR,
  },
});

export const removeColonyAdmin = createTxActionCreator<{
  user: string,
}>({
  context: COLONY_CONTEXT,
  methodName: 'removeAdminRole',
  lifecycle: {
    error: ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
  },
});
