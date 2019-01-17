/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { UsersProps } from '~immutable';
import type { Action } from '~types';

import { USER_PROFILE_FETCH_SUCCESS } from '../actionTypes';

const usernamesReducer = (
  state: $PropertyType<UsersProps, 'usernames'> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case USER_PROFILE_FETCH_SUCCESS: {
      const { key, props } = action.payload;
      return state.setIn([key, props.walletAddress], props.username);
    }

    default:
      return state;
  }
};

export default usernamesReducer;
