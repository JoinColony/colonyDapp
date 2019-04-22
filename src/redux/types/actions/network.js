/* @flow */

import type { Action, ActionTypeWithPayload, ErrorActionType } from '~redux';
import type { NetworkProps } from '~immutable';
import type { WithKey } from '~types';

import { ACTIONS } from '../../index';

export type NetworkActionTypes = {|
  NETWORK_FETCH: Action<typeof ACTIONS.NETWORK_FETCH>,
  NETWORK_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.NETWORK_FETCH_SUCCESS,
    NetworkProps,
  >,
  NETWORK_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.NETWORK_FETCH_ERROR,
    WithKey,
  >,
|};
