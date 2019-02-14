/* @flow */

import { ACTIONS } from '~redux';

import { COLONY_CONTEXT } from '../../lib/ColonyManager/constants';

import { createTxActionCreator } from './transactions';

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
