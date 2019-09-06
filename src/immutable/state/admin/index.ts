import { Collection, List, Map as ImmutableMap, RecordOf } from 'immutable';

import { ENSName } from '~types/index';
import {
  ContractTransactionRecord,
  FetchableDataRecord,
} from '~immutable/index';

export type AdminTransactionsState = ImmutableMap<
  ENSName,
  FetchableDataRecord<List<ContractTransactionRecord>>
>;

export type AdminUnclaimedTransactionsState = ImmutableMap<
  ENSName,
  FetchableDataRecord<List<ContractTransactionRecord>>
>;

export interface AdminStateProps {
  transactions: AdminTransactionsState;
  unclaimedTransactions: AdminUnclaimedTransactionsState;
}

export type AdminStateRecord = Collection<any, any> & RecordOf<AdminStateProps>;
