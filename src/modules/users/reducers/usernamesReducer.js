/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { UsernamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const usernamesReducer: ReducerType<
  UsernamesMap,
  {|
    CURRENT_USER_CREATE: *,
    USER_ADDRESS_FETCH_SUCCESS: *,
    USER_FETCH_SUCCESS: *,
    USERNAME_CREATE_SUCCESS: *,
    USERNAME_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_ADDRESS_FETCH_SUCCESS:
    case ACTIONS.USERNAME_FETCH_SUCCESS: {
      const { address, username } = action.payload;
      return state.set(address, username);
    }

    case ACTIONS.USERNAME_CREATE_SUCCESS: {
      const {
        from: address,
        params: { username },
      } = action.payload;
      return state.set(address, username);
    }

    case ACTIONS.CURRENT_USER_CREATE: {
      const {
        payload: {
          walletAddress,
          profileData: { username },
        },
      } = action;
      return username ? state.set(walletAddress, username) : state;
    }

    case ACTIONS.USER_FETCH_SUCCESS: {
      const {
        payload: { walletAddress, username },
      } = action;
      return username ? state.set(walletAddress, username) : state;
    }

    default:
      return state;
  }
};

export default usernamesReducer;
