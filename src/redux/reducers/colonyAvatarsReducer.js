/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { AllColonyAvatarsMap } from '~immutable';
import type { ReducerType } from '~redux';

const colonyAvatarsReducer: ReducerType<
  AllColonyAvatarsMap,
  {| COLONY_AVATAR_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_AVATAR_FETCH_SUCCESS: {
      const { hash, avatarData } = action.payload;
      return state.set(hash, avatarData);
    }
    default:
      return state;
  }
};

export default colonyAvatarsReducer;
