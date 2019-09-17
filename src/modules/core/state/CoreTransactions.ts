import { Record, Map as ImmutableMap } from 'immutable';

import { TransactionRecord, TransactionId } from '~immutable/index';
import { DefaultValues } from '~types/index';

import { CORE_TRANSACTIONS_LIST } from '../../../modules/core/constants';

export type TransactionsList = ImmutableMap<TransactionId, TransactionRecord>;

export interface CoreTransactionsProps {
  list: TransactionsList;
}

const defaultValues: DefaultValues<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap(),
};

export class CoreTransactionsRecord extends Record<CoreTransactionsProps>(
  defaultValues,
) {}

export const CoreTransactions = (p?: CoreTransactionsProps) =>
  new CoreTransactionsRecord(p);
