import { Map as ImmutableMap } from 'immutable';

import { ActionTypes, ReducerType } from '~redux/index';
import { FetchableData, AllColonyNamesMap } from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';

const updateState = (state: AllColonyNamesMap, key: any, value: string) =>
  state.getIn([key, 'record'])
    ? state
    : state.set(key, FetchableData({ record: value }));

const colonyNamesReducer: ReducerType<AllColonyNamesMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_ADDRESS_FETCH_SUCCESS:
    case ActionTypes.COLONY_NAME_FETCH_SUCCESS:
    case ActionTypes.COLONY_FETCH_SUCCESS: {
      const { colonyAddress, colonyName } = action.payload;

      /*
       * Maintain a two-directional map, so that we can look up by colonyName
       * or colonyAddress and get the same FetchableData interface.
       */
      const updated = updateState(state, colonyAddress, colonyName);
      return updateState(updated, colonyName, colonyAddress);
    }
    default:
      return state;
  }
};

export default withFetchableDataMap(
  new Set([ActionTypes.COLONY_NAME_FETCH, ActionTypes.COLONY_ADDRESS_FETCH]),
  ImmutableMap(),
)(colonyNamesReducer);
