/* @flow */

import type {
  Map as ImmutableMapType,
  RecordFactory,
  RecordOf,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { TransactionRecord, TransactionId } from '~immutable';
import type { GasPricesRecord } from './GasPrices';

import {
  CORE_TRANSACTIONS_LIST,
  CORE_GAS_PRICES,
} from '../../../modules/core/constants';

import GasPrices from './GasPrices';

export type TransactionsList = ImmutableMapType<
  TransactionId,
  TransactionRecord<*, *>,
>;

export type CoreTransactionsProps = {|
  list: TransactionsList,
  gasPrices: GasPricesRecord,
|};

const defaultValues: $Shape<CoreTransactionsProps> = {
  [CORE_TRANSACTIONS_LIST]: ImmutableMap(),
  [CORE_GAS_PRICES]: GasPrices(),
};

const CoreTransactions: RecordFactory<CoreTransactionsProps> = Record(
  defaultValues,
);

export type CoreTransactionsRecord = RecordOf<CoreTransactionsProps>;

export default CoreTransactions;
