/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import {
  DASHBOARD_ALL_TOKENS,
  DASHBOARD_TOKENS,
  DASHBOARD_TOKEN_ICONS,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

/*
 * Getters
 */
const getTokenAddressFromProps = (
  state: RootStateRecord,
  { tokenAddress }: { tokenAddress: string },
) => tokenAddress;

const getAllTokens = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);

const getTokens = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, DASHBOARD_TOKENS], ImmutableMap());

/*
 * Selectors
 */
export const tokenSelector = createSelector(
  getTokenAddressFromProps,
  getTokens,
  (tokenAddress, tokens) => tokens.get(tokenAddress),
);

// TODO get token/icon separately for much better selector performance
export const tokenWithIconSelector = createSelector(
  getTokenAddressFromProps,
  getAllTokens,
  (tokenAddress, allTokens) => {
    if (!allTokens) return undefined; // TODO why can this be undefined?
    const token = allTokens.getIn([DASHBOARD_TOKENS, tokenAddress]);
    const icon = allTokens.getIn([DASHBOARD_TOKEN_ICONS, tokenAddress]);
    return token ? token.set('icon', icon) : undefined;
  },
);
