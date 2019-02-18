/* @flow */

import type { ActionTypeWithPayload } from '~redux';
import type { GasPricesProps } from '~immutable';

import { ACTIONS } from '../../index';

export type GasPricesActionTypes = {|
  GAS_PRICES_UPDATE: ActionTypeWithPayload<
    typeof ACTIONS.GAS_PRICES_UPDATE,
    GasPricesProps,
  >,
|};
