import { List, Map as ImmutableMap, Record } from 'immutable';

import { Address } from '~types/index';
import {
  ContractTransactionRecord,
  ContractTransactionType,
  FetchableDataRecord,
  FetchableDataType,
} from '~immutable/index';

import { ADMIN_TRANSACTIONS, ADMIN_UNCLAIMED_TRANSACTIONS } from '../constants';

type ContractTransactionList = List<ContractTransactionRecord> & {
  toJS(): ContractTransactionType[];
};

export type FetchableContractTransactionList = FetchableDataRecord<
  ContractTransactionList
>;

export type AdminTransactionsState = ImmutableMap<
  Address,
  FetchableContractTransactionList
> & {
  toJS(): {
    [colonyAddress: string]: FetchableDataType<ContractTransactionType[]>;
  };
};

export type AdminUnclaimedTransactionsState = ImmutableMap<
  Address,
  FetchableContractTransactionList
> & {
  toJS(): {
    [colonyAddress: string]: FetchableDataType<ContractTransactionType[]>;
  };
};

export interface AdminStateProps {
  [ADMIN_TRANSACTIONS]: AdminTransactionsState;
  [ADMIN_UNCLAIMED_TRANSACTIONS]: AdminUnclaimedTransactionsState;
}

export class AdminStateRecord extends Record<AdminStateProps>({
  [ADMIN_TRANSACTIONS]: ImmutableMap() as AdminTransactionsState,
  // eslint-disable-next-line max-len
  [ADMIN_UNCLAIMED_TRANSACTIONS]: ImmutableMap() as AdminUnclaimedTransactionsState,
}) {}
