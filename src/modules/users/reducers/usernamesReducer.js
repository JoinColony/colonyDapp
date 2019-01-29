/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { UsernamesMap } from '~immutable';
import type { Action } from '~types';

import {
  USERNAME_FETCH_SUCCESS,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const usernamesReducer = (
  state: UsernamesMap = ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case USERNAME_FETCH_SUCCESS: {
      const { key, username } = action.payload;
      return state.set(key, username);
    }

    case USER_PROFILE_FETCH_SUCCESS: {
      const {
        payload: { walletAddress },
        meta: { keyPath: [username] } = {},
      } = action;
      return state.set(walletAddress, username);
    }

    default:
      return state;
  }
};

export default usernamesReducer;
