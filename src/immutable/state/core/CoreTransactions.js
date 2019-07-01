/* @flow */

import type {
  Map as ImmutableMapType,
  RecordFactory,
  RecordOf,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { TransactionRecordType, TransactionId } from '~immutable';

import { CORE_TRANSACTIONS_LIST } from '../../../modules/core/constants';

export type TransactionsList = ImmutableMapType<
  TransactionId,
  TransactionRecordType,
>;

export type CoreTransactionsProps = {|
  list: TransactionsList,
|};

const defaultValues: $Shape<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap(),
};

const CoreTransactions: RecordFactory<CoreTransactionsProps> = Record(
  defaultValues,
);

export type CoreTransactionsRecord = RecordOf<CoreTransactionsProps>;

export default CoreTransactions;
