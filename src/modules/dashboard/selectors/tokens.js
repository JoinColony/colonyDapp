/* @flow */

import { createSelector } from 'reselect';

import type {
  RootStateRecord,
  AllTokensRecord,
  TokenRecordType,
} from '~immutable';

import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

export const tokenAddressFromProps = (
  state: any,
  { tokenAddress }: Object,
): string => tokenAddress;

export const allTokensSelector = (state: RootStateRecord): ?AllTokensRecord =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);

export const tokenSelector = createSelector<
  RootStateRecord,
  any,
  ?TokenRecordType,
  *,
  *,
>(
  tokenAddressFromProps,
  allTokensSelector,
  (tokenAddress, allTokens) => {
    if (!allTokens) return undefined;
    const token = allTokens.getIn(['tokens', tokenAddress]);
    const icon = allTokens.getIn(['icons', tokenAddress]);
    return token ? token.set('icon', icon) : undefined;
  },
);
