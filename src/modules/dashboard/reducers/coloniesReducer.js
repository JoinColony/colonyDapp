/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_FETCH,
  COLONY_FETCH_SUCCESS,
  COLONY_PROFILE_UPDATE_SUCCESS,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_REMOVE_SUCCESS,
} from '../actionTypes';

import { Colony, Data, Token } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { ColonyRecord, DataMap } from '~immutable';
import type { Action, ENSName } from '~types';

const coloniesReducer = (
  state: DataMap<ENSName, ColonyRecord> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        props: { token, ensName, admins, ...props },
      } = action.payload;
      const record = Colony({
        ensName,
        token: Token(token),
        admins: ImmutableMap(admins),
        ...props,
      });
      return state.get(ensName)
        ? state.setIn([ensName, 'record'], record)
        : state.set(ensName, Data({ record }));
    }
    case COLONY_PROFILE_UPDATE_SUCCESS: {
      const { ensName, colonyUpdateValues } = action.payload;
      return state.mergeIn([ensName, 'record'], colonyUpdateValues);
    }
    case COLONY_AVATAR_UPLOAD_SUCCESS: {
      const { hash, ensName } = action.payload;
      return state.setIn([ensName, 'record', 'avatar'], hash);
    }
    case COLONY_AVATAR_REMOVE_SUCCESS: {
      const { ensName } = action.payload;
      return state.setIn([ensName, 'record', 'avatar'], undefined);
    }
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

export default withDataReducer<ENSName, ColonyRecord>(COLONY_FETCH)(
  coloniesReducer,
);
