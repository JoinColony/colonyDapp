/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { UsernamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const usernamesReducer: ReducerType<
  UsernamesMap,
  {| USERNAME_FETCH_SUCCESS: *, USER_PROFILE_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USERNAME_FETCH_SUCCESS: {
      const { key, username } = action.payload;
      return state.set(key, username);
    }

    case ACTIONS.USER_PROFILE_FETCH_SUCCESS: {
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
