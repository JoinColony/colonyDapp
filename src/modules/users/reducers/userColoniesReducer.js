/* @flow */

import { Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import type { Map as ImmutableMapType } from 'immutable';

import type { Address } from '~types';
import type { DataRecordType } from '~immutable';
import type { ReducerType } from '~redux';

import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

type ColoniesMap = ImmutableMapType<
  Address,
  DataRecordType<ImmutableSet<Address>>,
>;

const userColoniesReducer: ReducerType<
  ColoniesMap,
  {|
    USER_COLONY_SUBSCRIBE_SUCCESS: *,
    USER_COLONY_UNSUBSCRIBE_SUCCESS: *,
    USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_COLONY_SUBSCRIBE_SUCCESS: {
      const { colonyAddress, walletAddress } = action.payload;
      return state.updateIn([walletAddress, 'record'], addrs =>
        addrs ? addrs.add(colonyAddress) : ImmutableSet([colonyAddress]),
      );
    }
    case ACTIONS.USER_COLONY_UNSUBSCRIBE_SUCCESS: {
      const { colonyAddress, walletAddress } = action.payload;
      return state.updateIn([walletAddress, 'record'], addrs =>
        addrs ? addrs.subtract([colonyAddress]) : ImmutableSet(),
      );
    }
    case ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS: {
      const { colonyAddresses, walletAddress } = action.payload;
      return state.setIn(
        [walletAddress, 'record'],
        ImmutableSet(colonyAddresses),
      );
    }
    default: {
      return state;
    }
  }
};

export default withDataRecordMap<ColoniesMap, Address[]>(
  new Set([ACTIONS.USER_SUBSCRIBED_COLONIES_FETCH]),
  ImmutableMap(),
)(userColoniesReducer);
