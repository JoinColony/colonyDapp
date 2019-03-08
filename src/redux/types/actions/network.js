/* @flow */

import type { ActionTypeWithPayload } from '~redux';

import { ACTIONS } from '../../index';

export type GasPricesActionTypes = {|
  NETWORK_VERSION_UPDATE: ActionTypeWithPayload<
    typeof ACTIONS.NETWORK_VERSION_UPDATE,
    string,
  >,
|};
