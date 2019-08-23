import { ActionTypeWithPayload, ActionTypes } from '~redux/index';
import { GasPricesProps } from '~immutable/index';

export type GasPricesActionTypes = ActionTypeWithPayload<
  ActionTypes.GAS_PRICES_UPDATE,
  GasPricesProps
>;
