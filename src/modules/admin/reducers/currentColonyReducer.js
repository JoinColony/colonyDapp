/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_PROFILE_UPDATE_SUCCESS } from '../actionTypes';

import { Colony } from '~immutable';

import type { Action, ENSName } from '~types';

// TODO consider adding loading/error state, perhaps with a generalised
// higher order reducer (so we can use this pattern elsewhere).
type State = ImmutableMap<ENSName, Colony>;

const INITIAL_STATE: State = new ImmutableMap();

const currentColonyReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case COLONY_PROFILE_UPDATE_SUCCESS:
      return state ? state.merge(action.payload) : state;
    default:
      return state;
  }
};

export default currentColonyReducer;
