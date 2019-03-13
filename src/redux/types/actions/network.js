/* @flow */

import type { Action, ActionTypeWithPayload } from '~redux';
import type { NetworkProps } from '~immutable';

import { ACTIONS } from '../../index';

export type NetworkActionTypes = {|
  NETWORK_FETCH_VERSION: Action<typeof ACTIONS.NETWORK_FETCH_VERSION>,
  NETWORK_VERSION_UPDATE: ActionTypeWithPayload<
    typeof ACTIONS.NETWORK_VERSION_UPDATE,
    NetworkProps,
  >,
|};
