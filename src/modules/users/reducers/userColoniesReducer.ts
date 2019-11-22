import { Set as ImmutableSet, Map as ImmutableMap } from 'immutable';

import { Address } from '~types/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withFetchableDataMap } from '~utils/reducers';

import { ColoniesMap } from '../state/index';

const userColoniesReducer: ReducerType<ColoniesMap> = (
  state = ImmutableMap() as ColoniesMap,
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS: {
      const { colonyAddress, walletAddress } = action.payload;
      return state.updateIn([walletAddress, 'record'], addrs =>
        addrs ? addrs.add(colonyAddress) : ImmutableSet([colonyAddress]),
      );
    }
    case ActionTypes.USER_COLONY_UNSUBSCRIBE_SUCCESS: {
      const { colonyAddress, walletAddress } = action.payload;
      return state.updateIn([walletAddress, 'record'], addrs =>
        addrs ? addrs.delete(colonyAddress) : ImmutableSet(),
      );
    }
    case ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_EVENTS:
    case ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: {
      const { colonyAddresses, walletAddress } = action.payload;
      return state
        .setIn([walletAddress, 'record'], ImmutableSet(colonyAddresses))
        .setIn([walletAddress, 'isFetching'], false);
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<ColoniesMap, Address[]>(
  new Set([
    ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH,
    ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START,
  ]),
  ImmutableMap() as ColoniesMap,
)(userColoniesReducer);
