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

export const tokenSelector = (state: RootStateRecord, tokenAddress: Address) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, tokenAddress]);

/*
 * Selectors
 */
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
