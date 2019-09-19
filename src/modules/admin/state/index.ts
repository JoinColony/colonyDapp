import { List, Map as ImmutableMap, Record } from 'immutable';

import { ENSName } from '~types/index';
import {
  ContractTransactionRecord,
  FetchableDataRecord,
} from '~immutable/index';

import { ADMIN_TRANSACTIONS, ADMIN_UNCLAIMED_TRANSACTIONS } from '../constants';

export type AdminTransactionsState = ImmutableMap<
  ENSName,
  FetchableDataRecord<List<ContractTransactionRecord>>
>;

export type AdminUnclaimedTransactionsState = ImmutableMap<
  ENSName,
  FetchableDataRecord<List<ContractTransactionRecord>>
>;

export interface AdminStateProps {
  [ADMIN_TRANSACTIONS]: AdminTransactionsState;
  [ADMIN_UNCLAIMED_TRANSACTIONS]: AdminUnclaimedTransactionsState;
}

export class AdminStateRecord extends Record<AdminStateProps>({
  [ADMIN_TRANSACTIONS]: ImmutableMap(),
  [ADMIN_UNCLAIMED_TRANSACTIONS]: ImmutableMap(),
}) {}
