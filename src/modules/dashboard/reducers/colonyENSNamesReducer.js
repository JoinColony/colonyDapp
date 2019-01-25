/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_ENS_NAME_FETCH_SUCCESS } from '../actionTypes';

import type { UniqueActionWithKeyPath } from '~types';
import type { AllColonyENSNamesMap } from '~immutable';

const colonyENSNamesReducer = (
  state: AllColonyENSNamesMap = new ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_ENS_NAME_FETCH_SUCCESS: {
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

export default colonyENSNamesReducer;
