/* @flow */

import type { GasPricesRecord } from '~immutable';

import { GasPrices } from '~immutable';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

const coreGasPricesReducer: ReducerType<
  GasPricesRecord,
  {|
    GAS_PRICES_UPDATE: *,
  |},
> = (state = GasPrices(), action) => {
  switch (action.type) {
    case ACTIONS.GAS_PRICES_UPDATE:
      return GasPrices(action.payload);
    default:
      return state;
  }
};

export default coreGasPricesReducer;
