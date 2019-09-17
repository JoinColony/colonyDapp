import { RootStateRecord } from '../../state';
import { CORE_NAMESPACE as ns, CORE_GAS_PRICES } from '../constants';

export const gasPrices = (state: RootStateRecord) =>
  state.getIn([ns, CORE_GAS_PRICES]);
