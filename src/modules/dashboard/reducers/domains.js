/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { Domain } from '~immutable';

import type { Action } from '~types';
import { DOMAIN_FETCH_SUCCESS } from '../actionTypes';

type State = ImmutableMap<string, Domain>;

const INITIAL_STATE: State = new ImmutableMap();

const domainsReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case DOMAIN_FETCH_SUCCESS: {
      const {
        domainStoreData: { name, tasksDatabase },
        id,
        colonyENSName,
      } = action.payload;
      return state.setIn(
        [colonyENSName, id, 'domain'],
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
