/* @flow */

import type { ActionTypeWithPayload } from '~redux';
import type { NetworkProps } from '~immutable';

import { ACTIONS } from '../../index';

export type NetworkActionTypes = {|
  NETWORK_VERSION_UPDATE: ActionType<typeof ACTIONS.NETWORK_VERSION_UPDATE>,
  NETWORK_FETCH_VERSION: ActionTypeWithPayload<
    typeof ACTIONS.NETWORK_VERSION_UPDATE,
    NetworkProps,
  >,
|};
