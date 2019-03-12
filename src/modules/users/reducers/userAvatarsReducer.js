/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { UserAvatarsMap } from '~immutable';
import type { ReducerType } from '~redux';

const userAvatarsReducer: ReducerType<
  UserAvatarsMap,
  {| USER_AVATAR_FETCH_SUCCESS: *, USER_REMOVE_AVATAR_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_REMOVE_AVATAR_SUCCESS: {
      const { address } = action.payload;
      return state.delete(address);
    }
    case ACTIONS.USER_AVATAR_FETCH_SUCCESS: {
      const { avatar, address } = action.payload;
      return avatar ? state.set(address, avatar) : state.delete(address);
    }
    default:
      return state;
  }
};

export default userAvatarsReducer;
