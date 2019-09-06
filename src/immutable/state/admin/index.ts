import { Collection, List, Map as ImmutableMap, RecordOf } from 'immutable';

import { ENSName } from '~types/index';
import { ContractTransactionRecord, DataRecordType } from '~immutable/index';

export type AdminTransactionsState = ImmutableMap<
  ENSName,
  DataRecordType<List<ContractTransactionRecord>>
>;

export type AdminUnclaimedTransactionsState = ImmutableMap<
  ENSName,
  DataRecordType<List<ContractTransactionRecord>>
>;

export interface AdminStateProps {
  transactions: AdminTransactionsState;
  unclaimedTransactions: AdminUnclaimedTransactionsState;
}

export type AdminStateRecord = Collection<any, any> & RecordOf<AdminStateProps>;
