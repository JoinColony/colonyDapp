/* @flow */

import type { ReducerType } from '~redux';

import type { DataRecordType, NetworkType } from '~immutable';

import { Network, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type State = DataRecordType<NetworkType>;

type NetworkActions = {
  NETWORK_FETCH_FEE: *,
  NETWORK_FETCH_FEE_ERROR: *,
  NETWORK_FETCH_FEE_SUCCESS: *,
  NETWORK_FETCH_VERSION: *,
  NETWORK_FETCH_VERSION_ERROR: *,
  NETWORK_FETCH_VERSION_SUCCESS: *,
};

const coreNetworkReducer: ReducerType<NetworkType, NetworkActions> = (
  state = DataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.NETWORK_FETCH_FEE_SUCCESS:
      return state.set('record', Network(action.payload));
    case ACTIONS.NETWORK_FETCH_VERSION_SUCCESS:
      return state.set('record', Network(action.payload));
    default:
      return state;
  }
};

export default withDataRecord<State, NetworkActions>(
  new Set([ACTIONS.NETWORK_FETCH_FEE, ACTIONS.NETWORK_FETCH_VERSION]),
)(coreNetworkReducer);
