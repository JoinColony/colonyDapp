/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { UsersProps } from '~immutable';
import type { Action } from '~types';

import {
  USERNAME_FETCH_SUCCESS,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

const usernamesReducer = (
  state: $PropertyType<UsersProps, 'usernames'> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case USERNAME_FETCH_SUCCESS: {
      const { key, username } = action.payload;
      return state.set(key, username);
    }

    case USER_PROFILE_FETCH_SUCCESS: {
      const { props } = action.payload;
      return state.set(props.walletAddress, props.username);
    }

    default:
      return state;
  }
};

export default usernamesReducer;
