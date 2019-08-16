import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import { Address, ENSName } from '~types/index';
import { RootStateRecord } from '~immutable/index';

import { sortObjectsBy, sortTokensByEth } from '~utils/arrays';

import { tokenIsETH } from '../../core/checks';
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
    // @ts-ignore
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

export const colonyEthTokenSelector = createSelector(
  colonySelector,
  colony =>
    colony
      ? colony.getIn(['record', 'tokens'], ImmutableMap()).find(tokenIsETH)
      : null,
);

/**
 * Get an array of `TokenReference`s for any "recent" tokens used in the
 * colony. This includes the colony's set tokens, as well as any used in recent
 * transactions to/from the colony.
 */
export const colonyRecentTokensSelector = createSelector(
  colonyTokensSelector,
  colonyTransactionsSelector,
  colonyUnclaimedTransactionsSelector,
  (colonyTokens, transactions, unclaimedTransactions) =>
    Array.from(
      new Map([
        ...colonyTokens.map(token => [token.address, token]),
        ...[
          ...((transactions && transactions.record) || []),
          ...((unclaimedTransactions && unclaimedTransactions.record) || []),
        ].map(({ token }) => [token, { address: token }]),
      ]).values(),
    ),
);

/*
 * Given a colony's address, select (with fallback):
 * - The display name
 * - The ens name (colonyName)
 * - The colony's address
 */
export const friendlyColonyNameSelector = createSelector(
  colonySelector,
  (_, colonyAddress) => colonyAddress,
  (colony, colonyAddress): string => {
    // @ts-ignore
    const { displayName, colonyName } =
      (colony && colony.getIn(['record'])) || {};
    return displayName || colonyName || colonyAddress;
  },
);
