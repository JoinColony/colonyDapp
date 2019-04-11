/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { AllColonyNamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const colonyNamesReducer: ReducerType<
  AllColonyNamesMap,
  {| COLONY_NAME_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_NAME_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [colonyAddress],
        },
        payload: colonyName,
      } = action;
      return state.set(colonyAddress, colonyName);
    }
    default:
      return state;
  }
};

export default colonyNamesReducer;
