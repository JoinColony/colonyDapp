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
      const { username } = action.payload;
      return state.delete(username);
    }
    case ACTIONS.USER_AVATAR_FETCH_SUCCESS: {
      const { avatar, username } = action.payload;
      return avatar ? state.set(username, avatar) : state.delete(username);
    }
    default:
      return state;
  }
};

export default userAvatarsReducer;
