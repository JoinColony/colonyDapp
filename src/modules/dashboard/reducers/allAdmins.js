/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_REMOVE_SUCCESS,
} from '../actionTypes';

import type { ColonyRecord, DataRecord } from '~immutable';
import type { Action, ENSName } from '~types';

const adminsReducer = (
  state: ImmutableMap<ENSName, DataRecord<ColonyRecord>> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case COLONY_ADMIN_ADD_SUCCESS: {
      const { ensName, adminData } = action.payload;
      return state
        ? state.setIn(
            [ensName, 'record', 'admins', adminData.username],
            adminData.toObject(),
          )
        : state;
    }
    case COLONY_ADMIN_REMOVE_SUCCESS: {
      const { ensName, username } = action.payload;
      return state
        ? state.deleteIn([ensName, 'record', 'admins', username])
        : state;
    }
    default:
      return state;
  }
};

export default adminsReducer;
