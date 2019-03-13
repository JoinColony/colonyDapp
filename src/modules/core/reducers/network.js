/* @flow */

import type { ReducerType } from '~redux';

import type { NetworkType } from '~immutable';

import { Network, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type NetworkActions = {
  NETWORK_FETCH_VERSION: *,
  NETWORK_FETCH_VERSION_SUCCESS: *,
  NETWORK_FETCH_VERSION_ERROR: *,
};

const coreNetworkReducer: ReducerType<NetworkType, NetworkActions> = (
  state = DataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.NETWORK_FETCH_VERSION_SUCCESS:
      return state.set('record', Network(action.payload));
    default:
      return state;
  }
};

export default withDataRecord<NetworkType, NetworkActions>(
  ACTIONS.NETWORK_FETCH_VERSION,
)(coreNetworkReducer);
