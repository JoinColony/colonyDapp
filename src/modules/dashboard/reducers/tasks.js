/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { DRAFT_CREATE_SUCCESS, DRAFT_FETCH_SUCCESS } from '../actionTypes';

import { Draft, Task } from '~immutable';

import type { Action } from '~types';

type State = ImmutableMap<string, Task | Draft>;

const INITIAL_STATE: State = new ImmutableMap();

const tasksReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case DRAFT_FETCH_SUCCESS:
    case DRAFT_CREATE_SUCCESS: {
      const {
        draft: { id },
        draft,
      } = action.payload;
      return state.set(id, Draft(draft));
    }
    default:
      return state;
  }
};

export default tasksReducer;
