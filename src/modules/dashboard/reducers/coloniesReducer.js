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

import type { ColonyRecord, DataRecord } from '~immutable';
import type { UniqueActionWithKeyPath, ENSName } from '~types';

const coloniesReducer = (
  state: ImmutableMap<ENSName, DataRecord<ColonyRecord>> = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        payload: { token, ensName, admins, ...props },
      } = action;
      const record = Colony({
        token: Token(token),
        admins: ImmutableMap(admins),
        ensName,
        ...props,
      });
      return state.get(ensName)
        ? state.setIn([ensName, 'record'], record)
        : state.set(ensName, Data({ record }));
    }
    case COLONY_PROFILE_UPDATE_SUCCESS: {
      const {
        meta: { keyPath },
        payload,
      } = action;
      return state.mergeIn([...keyPath, 'record'], payload);
    }
    case COLONY_AVATAR_UPLOAD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: hash,
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], hash);
    }
    case COLONY_AVATAR_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
      } = action;
      return state.setIn([...keyPath, 'record', 'avatar'], undefined);
    }
    case COLONY_ADMIN_ADD_SUCCESS: {
      const {
        meta: { keyPath },
        payload: adminData,
      } = action;
      return state
        ? state.setIn(
            [...keyPath, 'record', 'admins', adminData.username],
            adminData.toObject(),
          )
        : state;
    }
    case COLONY_ADMIN_REMOVE_SUCCESS: {
      const {
        meta: { keyPath },
        payload: username,
      } = action;
      return state
        ? state.deleteIn([...keyPath, 'record', 'admins', username])
        : state;
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, ColonyRecord>(COLONY_FETCH)(
  coloniesReducer,
);
