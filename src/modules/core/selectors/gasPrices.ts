import { RootStateRecord } from '~immutable/index';

import { CORE_NAMESPACE as ns, CORE_GAS_PRICES } from '../constants';

export const gasPrices = (state: RootStateRecord) =>
  state.getIn([ns, CORE_GAS_PRICES]);
