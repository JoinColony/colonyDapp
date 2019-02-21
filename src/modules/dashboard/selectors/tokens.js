/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

/*
 * Tokens selectors
 */
export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS], ImmutableMap());

export const tokensSelector = createSelector(
  allTokensSelector,
  allTokens => allTokens.toList(),
);
