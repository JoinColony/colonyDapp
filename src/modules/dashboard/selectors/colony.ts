import { createSelector } from 'reselect';
import BigNumber from 'bn.js';
import { Map as ImmutableMap } from 'immutable';
import { ColonyRecord } from '~immutable/Colony';
import { FetchableDataRecord } from '~immutable/FetchableData';

import { Address, ENSName } from '~types/index';

import { sortObjectsBy, sortTokensByEth } from '~utils/arrays';

import { RootStateRecord } from '../../state';
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
import { AllColonyNamesMap } from '../state';

/*
 * Input selectors
 */
export const colonyNamesSelector = (
  state: RootStateRecord,
): AllColonyNamesMap =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONY_NAMES]);

export const colonyNameSelector = (
  state: RootStateRecord,
  colonyAddress: Address | undefined,
): FetchableDataRecord<string> | null =>
  colonyAddress
    ? state.getIn([
        ns,
        DASHBOARD_ALL_COLONIES,
        DASHBOARD_COLONY_NAMES,
        colonyAddress,
      ])
    : null;

export const colonyAddressSelector = (
  state: RootStateRecord,
  colonyName: ENSName,
): FetchableDataRecord<string> =>
  state.getIn([ns, DASHBOARD_ALL_COLONIES, DASHBOARD_COLONY_NAMES, colonyName]);

export const colonySelector = (
  state: RootStateRecord,
  colonyAddress: Address | undefined,
): FetchableDataRecord<ColonyRecord> | undefined =>
  colonyAddress
    ? state.getIn([
        ns,
        DASHBOARD_ALL_COLONIES,
        DASHBOARD_COLONIES,
        colonyAddress,
      ])
    : null;

export const colonyAvatarHashSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): string | undefined =>
  state.getIn([
    ns,
    DASHBOARD_ALL_COLONIES,
    DASHBOARD_COLONIES,
    colonyAddress,
    'record',
    'avatar',
  ]);

export const tokenBalanceSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  tokenAddress: Address,
  domainId: number,
): BigNumber | undefined =>
  state.getIn([
    ns,
    DASHBOARD_ALL_COLONIES,
    DASHBOARD_COLONIES,
    colonyAddress,
    'record',
    'tokens',
    tokenAddress,
    'balances',
    domainId.toString(),
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
          // @ts-ignore
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
          // @ts-ignore
          .getIn(['record', 'tokens'], ImmutableMap())
          .find(token => !!token && token.isNative)
      : null,
);

export const colonyEthTokenSelector = createSelector(
  colonySelector,
  colony =>
    colony
      ? colony
          // @ts-ignore
          .getIn(['record', 'tokens'], ImmutableMap())
          .find(tokenIsETH)
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
        ...[
          ...((transactions && transactions.record) || []),
          ...((unclaimedTransactions && unclaimedTransactions.record) || []),
        ].map(({ token }) => [token, { address: token }]),
        ...colonyTokens.map(token => [token.address, token]),
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
