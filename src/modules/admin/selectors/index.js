/* @flow */

import type { Map as ImmutableMap, List } from 'immutable';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ContractTransactionRecord } from '~immutable';

type TransactionsMap = ImmutableMap<ENSName, List<ContractTransactionRecord>>;

type RootState = {
  [typeof ns]: {
    transactions: TransactionsMap,
    unclaimedTransactions: TransactionsMap,
  },
};

export const colonyTransactions = (state: RootState, ensName: ENSName) =>
  state[ns].transactions.get(ensName);

export const colonyUnclaimedTransactions = (
  state: RootState,
  ensName: ENSName,
) => state[ns].unclaimedTransactions.get(ensName);
