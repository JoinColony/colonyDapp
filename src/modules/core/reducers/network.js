/* @flow */

import type { ReducerType } from '~redux';

import type { DataRecordType, NetworkType } from '~immutable';

import { Network, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<NetworkType>;

type NetworkActions = {
  NETWORK_FETCH: *,
  NETWORK_FETCH_ERROR: *,
  NETWORK_FETCH_SUCCESS: *,
};

const coreNetworkReducer: ReducerType<NetworkType, NetworkActions> = (
  state = DataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.NETWORK_FETCH_SUCCESS:
      return state.set('record', Network(action.payload));
    default:
      return state;
  }
};

export default withDataRecord<State, NetworkActions>(ACTIONS.NETWORK_FETCH)(
  coreNetworkReducer,
);
