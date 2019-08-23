import { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import { RootStateRecord } from '~immutable/index';

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
export const networkSelector = (state: RootStateRecord) =>
  // @ts-ignore
  state.getIn([ns, CORE_NETWORK], ImmutableMap());

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
