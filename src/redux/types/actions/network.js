/* @flow */

import type { Action, ActionTypeWithPayload, ErrorActionType } from '~redux';
import type { NetworkProps } from '~immutable';
import type { WithKey } from '~types';

import { ACTIONS } from '../../index';

export type NetworkActionTypes = {|
  NETWORK_FETCH_VERSION: Action<typeof ACTIONS.NETWORK_FETCH_VERSION>,
  NETWORK_FETCH_VERSION_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.NETWORK_FETCH_VERSION_SUCCESS,
    NetworkProps,
  >,
  NETWORK_FETCH_VERSION_ERROR: ErrorActionType<
    typeof ACTIONS.NETWORK_FETCH_VERSION_ERROR,
    WithKey,
  >,
|};
