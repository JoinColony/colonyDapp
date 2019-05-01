/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord, TokenReferenceType } from '~immutable';
import type { Address } from '~types';

import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

/*
 * Input selectors
 */
export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);

export const tokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS], ImmutableMap());

export const tokensByAddressesSelector = (
  state: RootStateRecord,
  tokenAddresses: string[],
) =>
  state
    .getIn([ns, DASHBOARD_ALL_TOKENS], ImmutableMap())
    .filter((_, address) => tokenAddresses.includes(address));

export const tokenSelector = (state: RootStateRecord, tokenAddress: Address) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, tokenAddress]);

/*
 * Selectors
 */
export const allFromColonyTokensSelector = createSelector<
  RootStateRecord,
  Array<TokenReferenceType>,
  *,
  *,
  *,
>(
  state => state,
  (state, tokens) => tokens.map(({ address }) => address),
  tokensByAddressesSelector,
);

allFromColonyTokensSelector.transform = input =>
  input
    .map(token => token.record)
    .filter(Boolean)
    .toList()
    .toJS();

export const nativeFromColonyTokensSelector = createSelector<
  RootStateRecord,
  Array<TokenReferenceType>,
  *,
  *,
  *,
>(
  state => state,
  (state, tokens) => (tokens.find(({ isNative }) => !!isNative) || {}).address,
  tokenSelector,
);
