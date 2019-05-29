/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';

import type { AllColonyNamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const updateState = (state: AllColonyNamesMap, key: any, value: string) =>
  state.getIn([key, 'record'])
    ? state
    : state.set(key, DataRecord({ record: value }));

const colonyNamesReducer: ReducerType<
  AllColonyNamesMap,
  {|
    COLONY_ADDRESS_FETCH: *,
    COLONY_ADDRESS_FETCH_ERROR: *,
    COLONY_ADDRESS_FETCH_SUCCESS: *,
    COLONY_NAME_FETCH: *,
    COLONY_NAME_FETCH_ERROR: *,
    COLONY_NAME_FETCH_SUCCESS: *,
    COLONY_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_ADDRESS_FETCH_SUCCESS:
    case ACTIONS.COLONY_NAME_FETCH_SUCCESS:
    case ACTIONS.COLONY_FETCH_SUCCESS: {
      const { colonyAddress, colonyName } = action.payload;
      /*
       * Maintain a two-directional map, so that we can look up by colonyName
       * or colonyAddress and get the same DataRecord interface.
       */
      const updated = updateState(state, colonyAddress, colonyName);
      return updateState(updated, colonyName, colonyAddress);
    }
    default:
      return state;
  }
};

export default withDataRecordMap(ACTIONS.COLONY_NAME_FETCH, ImmutableMap())(
  colonyNamesReducer,
);
