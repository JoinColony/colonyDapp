/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_FETCH_SUCCESS,
  COLONY_PROFILE_UPDATE_SUCCESS,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_AVATAR_FETCH_SUCCESS,
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_ADMIN_ADD_SUCCESS,
} from '../actionTypes';

import { Colony, Token } from '~immutable';

import type { Action, ENSName } from '~types';

// TODO consider adding loading/error state, perhaps with a generalised
// higher order reducer (so we can use this pattern elsewhere).
type State = ImmutableMap<ENSName, Colony>;

const INITIAL_STATE: State = new ImmutableMap();

const coloniesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        colonyStoreData: { ensName, token, ...colonyStoreData },
      } = action.payload;
      return state.set(
        ensName,
        Colony({
          ensName,
          token: Token(token),
          ...colonyStoreData,
        }),
      );
    }
    case COLONY_PROFILE_UPDATE_SUCCESS:
      return state ? state.merge(action.payload) : state;
    case COLONY_AVATAR_UPLOAD_SUCCESS: {
      const { hash, ensName } = action.payload;
      return state ? state.setIn([ensName, 'avatar'], hash) : state;
    }
    case COLONY_AVATAR_FETCH_SUCCESS: {
      const { hash, avatarData } = action.payload;
      return state.setIn(['avatars', hash], avatarData);
    }
    case COLONY_AVATAR_REMOVE_SUCCESS: {
      const { ensName } = action.payload;
      return state ? state.setIn([ensName, 'avatar'], undefined) : state;
    }
    case COLONY_ADMIN_ADD_SUCCESS: {
      const { ensName, adminData } = action.payload;
      /*
       * @NOTE Flow complains about a wrong tuple type here, but it's being
       * used in the same way as everywhere else (see above)
       * I have a feeling that error is throwing me off track, and something
       * else is at play here.
       */
      /* $FlowFixMe */
      return state ? state.setIn([ensName, 'admins'], adminData) : state;
    }
    default:
      return state;
  }
};

export default coloniesReducer;
