/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';

import type { AllColonyENSNamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const colonyNamesReducer: ReducerType<
  AllColonyENSNamesMap,
  {| COLONY_ENS_NAME_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_ENS_NAME_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [colonyAddress],
        },
        payload: ensName,
      } = action;
      return state.set(colonyAddress, ensName);
    }
    default:
      return state;
  }
};

export default colonyNamesReducer;
