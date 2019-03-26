/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type {
  AllTokensRecord,
  RootStateRecord,
  TokenReferenceType,
} from '~immutable';
import type { Address } from '~types';

import {
  DASHBOARD_ALL_TOKENS,
  DASHBOARD_TOKEN_ICONS,
  DASHBOARD_TOKENS,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

/*
 * Getters
 */
const getTokenWithIcon = (
  tokenAddress: string,
  allTokens: ?AllTokensRecord,
) => {
  // allTokens _will_ be defined. The following code is not included in the bundle:
  // eslint-disable-next-line
  /*:: if (!allTokens) throw Error(); */

  const token = allTokens.getIn([DASHBOARD_TOKENS, tokenAddress]);
  const icon = allTokens.getIn([DASHBOARD_TOKEN_ICONS, tokenAddress]);
  return token ? token.set('icon', icon) : undefined;
};

/*
 * Input selectors
 */
export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);

export const tokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, DASHBOARD_TOKENS], ImmutableMap());

export const tokenSelector = (state: RootStateRecord, tokenAddress: Address) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, DASHBOARD_TOKENS], tokenAddress);

/*
 * Selectors
 */
// TODO get token/icon separately for much better selector performance
export const tokenWithIconSelector = createSelector(
  (state: RootStateRecord, tokenAddress: Address) => tokenAddress,
  allTokensSelector,
  getTokenWithIcon,
);

export const nativeFromColonyTokensSelector = createSelector<
  RootStateRecord,
  Array<TokenReferenceType>,
  *,
  *,
  *,
>(
  (state, tokens) => (tokens.find(({ isNative }) => !!isNative) || {}).address,
  allTokensSelector,
  getTokenWithIcon,
);
