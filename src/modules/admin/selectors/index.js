/* @flow */

import type { List, Map as ImmutableMapType } from 'immutable';

import ns from '../namespace';

import type { ENSName } from '~types';
import type { ContractTransactionRecord, Data } from '~immutable';

type ContractTransactionListData = Data<List<ContractTransactionRecord>>;
type TransactionsMap = ImmutableMapType<ENSName, ContractTransactionListData>;

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
