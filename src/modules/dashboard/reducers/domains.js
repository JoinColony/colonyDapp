/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { DOMAIN_FETCH_SUCCESS } from '../actionTypes';

import { Domain } from '~immutable';

import type { Action } from '~types';

type State = ImmutableMap<string, Domain>;

const INITIAL_STATE: State = new ImmutableMap();

const domainsReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case DOMAIN_FETCH_SUCCESS: {
      const {
        domainStoreData: { name, tasksDatabase },
        id,
      } = action.payload;
      return state.set(
        id,
        Domain({
          tasksDatabase,
          name,
          id,
        }),
      );
    }
    default:
      return state;
  }
};

export default domainsReducer;
