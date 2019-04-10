/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { Address, ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import { sortObjectsBy, sortTokensByEth } from '~utils/arrays';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_COLONIES,
  DASHBOARD_COLONY_NAMES,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

import {
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
} from '../../admin/selectors';

/*
 * Input selectors
 */
export const colonyNamesSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONY_NAMES],
    ImmutableMap(),
  );

export const colonyNameSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) =>
  state.getIn([
    ns,
    DASHBOARD_ALL_COLONIES,
    DASHBOARD_COLONY_NAMES,
    colonyAddress,
  ]);

export const colonyAddressSelector = (
  state: RootStateRecord,
  colonyName: ENSName,
) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONY_NAMES, colonyName]);

export const colonySelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONIES, colonyAddress]);

export const colonyAvatarHashSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) =>
  // $FlowFixMe the length of this path exceeds what the types support.
  state.getIn([
    ns,
    DASHBOARD_ALL_COLONIES,
    DASHBOARD_COLONIES,
    colonyAddress,
    'record',
    'avatar',
  ]);

/*
 * Selectors
 */
export const allColonyNamesSelector = createSelector(
  colonyNamesSelector,
  colonies => colonies.keySeq(),
);

export const colonyTokensSelector = createSelector(
  colonySelector,
  colony =>
    colony
      ? colony
          .getIn(['record', 'tokens'], ImmutableMap())
          .valueSeq()
          .sort(sortTokensByEth)
          .sort(sortObjectsBy('isNative'))
          .toJS()
      : [],
);

export const colonyNativeTokenSelector = createSelector(
  colonySelector,
  colony =>
    colony
      ? colony
          .getIn(['record', 'tokens'], ImmutableMap())
          .find(token => !!token && token.isNative)
      : null,
);

export const colonyRecentTokensSelector = createSelector(
  colonySelector,
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
  (colony, transactions, unclaimedTransactions) => {
    const currentTokens =
      (colony &&
        colony.record &&
        colony.record.tokens &&
        colony.record.tokens.entries()) ||
      [];
    return Array.from(
      new Map([
        ...currentTokens,
        ...[
          ...((transactions && transactions.record) || []),
          ...((unclaimedTransactions && unclaimedTransactions.record) || []),
        ].map(({ token }) => [token, { address: token }]),
      ]).values(),
    );
  },
);
