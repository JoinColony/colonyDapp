import { GasPricesRecord, GasPrices } from '~immutable/index';

import { ActionTypes, ReducerType } from '~redux/index';

const coreGasPricesReducer: ReducerType<GasPricesRecord> = (
  state = GasPrices(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.GAS_PRICES_UPDATE:
      return GasPrices(action.payload);
    default:
      return state;
  }
};

export default coreGasPricesReducer;
