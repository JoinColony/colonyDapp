import { RecordOf, Record, Map as ImmutableMap } from 'immutable';

import { TransactionRecord, TransactionId } from '~immutable/index';

import { CORE_TRANSACTIONS_LIST } from '../../../modules/core/constants';

export type TransactionsList = ImmutableMap<TransactionId, TransactionRecord>;

export interface CoreTransactionsProps {
  list: TransactionsList;
}

const defaultValues: CoreTransactionsProps = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap(),
};

export const CoreTransactions: Record.Factory<CoreTransactionsProps> = Record(
  defaultValues,
);

export type CoreTransactionsRecord = RecordOf<CoreTransactionsProps>;
