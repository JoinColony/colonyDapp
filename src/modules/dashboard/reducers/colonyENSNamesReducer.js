/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_ENS_NAME_FETCH_SUCCESS } from '../actionTypes';

import type { Action } from '~types';

const colonyENSNamesReducer = (
  state: ImmutableMap<string, string> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case COLONY_ENS_NAME_FETCH_SUCCESS: {
      const { key, ensName } = action.payload;
      return state.set(key, ensName);
    }
    default:
      return state;
  }
};

export default colonyENSNamesReducer;
