import { Record, Map as ImmutableMap } from 'immutable';

import {
  TransactionRecord,
  TransactionId,
  TransactionType,
} from '~immutable/index';
import { DefaultValues, RecordToJS } from '~types/index';

import { CORE_TRANSACTIONS_LIST } from '../../../modules/core/constants';

type TransactionsListObject = { [transactionId: string]: TransactionType };

export type TransactionsListMap = ImmutableMap<
  TransactionId,
  TransactionRecord
> & { toJS(): TransactionsListObject };

export interface CoreTransactionsProps {
  list: TransactionsListMap;
}

const defaultValues: DefaultValues<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap() as TransactionsListMap,
};

export class CoreTransactionsRecord
  extends Record<CoreTransactionsProps>(defaultValues)
  implements RecordToJS<{ list: TransactionsListObject }> {}

export const CoreTransactions = (p?: CoreTransactionsProps) =>
  new CoreTransactionsRecord(p);
