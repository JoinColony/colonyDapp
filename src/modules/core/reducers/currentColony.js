/* @flow */

import {
  CURRENT_COLONY_CREATE,
  CURRENT_COLONY_UPDATE,
  CURRENT_COLONY_REMOVE,
} from '../actionTypes';

import type { Action } from '~types/index';

import { Colony } from '../records';

type State = Colony | null;

const INITIAL_STATE = null;

const currentColonyReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case CURRENT_COLONY_CREATE:
      return Colony(action.payload);
    case CURRENT_COLONY_UPDATE:
      return state ? state.merge(action.payload) : null;
    case CURRENT_COLONY_REMOVE:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default currentColonyReducer;
