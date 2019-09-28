import { createSelector } from 'reselect';
import { NetworkRecord } from '~immutable/Network';

import { RootStateRecord } from '../../state';
import {
  CORE_NAMESPACE as ns,
  CORE_NETWORK,
  CORE_NETWORK_FEE,
  CORE_NETWORK_FEE_INVERSE,
  CORE_NETWORK_VERSION,
} from '../constants';

/*
 * Input selectors
 */
export const networkSelector = (state: RootStateRecord): NetworkRecord =>
  state.getIn([ns, CORE_NETWORK]);

export const networkFeeSelector = createSelector(
  networkSelector,
  state => state.getIn(['record', CORE_NETWORK_FEE]),
);

export const networkFeeInverseSelector = createSelector(
  networkSelector,
  state => state.getIn(['record', CORE_NETWORK_FEE_INVERSE]),
);

export const networkVersionSelector = createSelector(
  networkSelector,
  state => state.getIn(['record', CORE_NETWORK_VERSION]),
);
