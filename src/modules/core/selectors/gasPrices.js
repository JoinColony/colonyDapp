/* @flow */

import type { RootStateRecord } from '~immutable';

import { CORE_NAMESPACE as ns, CORE_GAS_PRICES } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const gasPrices = (state: RootStateRecord) =>
  state.getIn([ns, CORE_GAS_PRICES]);
