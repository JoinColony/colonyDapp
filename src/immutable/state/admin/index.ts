import { Collection, List, Map as ImmutableMap, RecordOf } from 'immutable';

import { ENSName } from '~types/index';
import {
  ContractTransactionRecordType,
  DataRecordType,
} from '~immutable/index';

export type AdminTransactionsState = ImmutableMap<
  ENSName,
  DataRecordType<List<ContractTransactionRecordType>>
>;

export type AdminUnclaimedTransactionsState = ImmutableMap<
  ENSName,
  DataRecordType<List<ContractTransactionRecordType>>
>;

export interface AdminStateProps {
  transactions: AdminTransactionsState;
  unclaimedTransactions: AdminUnclaimedTransactionsState;
}

export type AdminStateRecord = Collection<any, any> & RecordOf<AdminStateProps>;
