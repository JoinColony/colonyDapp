/* @flow */

import type { ActionType } from '~types';

import { ACTIONS } from '../../index';

export type GasPricesActionTypes = {|
  // TODO type this
  GAS_PRICES_UPDATE: ActionType<typeof ACTIONS.GAS_PRICES_UPDATE, any, void>,
|};
