/* @flow */

import type { NetworkRecord } from '~immutable';

import { Network } from '~immutable';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

const coreNetworkReducer: ReducerType<
  NetworkRecord,
  {|
    NETWORK_FETCH_VERSION_SUCCESS: *,
  |},
> = (state = Network(), action) => {
  switch (action.type) {
    case ACTIONS.NETWORK_FETCH_VERSION_SUCCESS:
      return Network(action.payload);
    default:
      return state;
  }
};

export default coreNetworkReducer;
