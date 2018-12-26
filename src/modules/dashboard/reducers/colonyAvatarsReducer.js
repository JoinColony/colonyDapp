/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_AVATAR_FETCH_SUCCESS } from '../actionTypes';

import type { Action } from '~types';

const colonyAvatarsReducer = (
  state: ImmutableMap<string, string> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case COLONY_AVATAR_FETCH_SUCCESS: {
      const { hash, avatarData } = action.payload;
      return state.set(hash, avatarData);
    }
    default:
      return state;
  }
};

export default colonyAvatarsReducer;
