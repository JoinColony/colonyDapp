import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import {
  ColonyTokenReferenceType,
  FetchableDataRecord,
  TokenRecord,
} from '~immutable/index';
import { Address } from '~types/index';

import { RootStateRecord } from '../../state';
import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

/*
 * Input selectors
 */
export const tokensByAddressesSelector = (
  state: RootStateRecord,
  tokenAddresses: string[],
) =>
  (state.getIn([ns, DASHBOARD_ALL_TOKENS]) || ImmutableMap()).filter(
    (_, address) => tokenAddresses.includes(address),
  );

export const tokenSelector = (
  state: RootStateRecord,
  tokenAddress: Address,
): FetchableDataRecord<TokenRecord> =>
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
