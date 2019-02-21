/* @flow */

import { createSelector } from 'reselect';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

/*
 * Tokens selectors
 */
export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS], {});

export const tokensSelector = createSelector(
  allTokensSelector,
  ({ allTokens: tokens, icons }) =>
    tokens.forEach((value, key) => {
      const iconLocation = icons.get(key);
      const tokenRecord = tokens[key];
      tokenRecord.icon = iconLocation;
      tokens.set(key, tokens[key]);
    }),
);
