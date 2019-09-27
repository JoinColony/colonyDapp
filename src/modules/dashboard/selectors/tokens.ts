import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import { ColonyTokenReferenceType } from '~immutable/index';
import { Address } from '~types/index';

import { RootStateRecord } from '../../state';
import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

/*
 * Input selectors
 */
export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);

export const tokensSelector = (state: RootStateRecord) =>
  // @ts-ignore
  state.getIn([ns, DASHBOARD_ALL_TOKENS], ImmutableMap());

export const tokensByAddressesSelector = (
  state: RootStateRecord,
  tokenAddresses: string[],
) =>
  state
    // @ts-ignore
    .getIn([ns, DASHBOARD_ALL_TOKENS], ImmutableMap())
    .filter((_, address) => tokenAddresses.includes(address));

export const tokenSelector = (state: RootStateRecord, tokenAddress: Address) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, tokenAddress]);

/*
 * Selectors
 */
export const allFromColonyTokensSelector = createSelector<
  RootStateRecord,
  ColonyTokenReferenceType[],
  any,
  any,
  any
>(
  state => state,
  (state, tokens) => tokens.map(({ address }) => address),
  tokensByAddressesSelector,
);

Object.defineProperty(allFromColonyTokensSelector, 'transform', {
  value: input =>
    input
      .map(token => token.record)
      .filter(Boolean)
      .toList()
      .toJS(),
});

export const nativeFromColonyTokensSelector = createSelector<
  RootStateRecord,
  ColonyTokenReferenceType[],
  any,
  any,
  any
>(
  state => state,
  // @ts-ignore
  (state, tokens) => (tokens.find(({ isNative }) => !!isNative) || {}).address,
  tokenSelector,
);
