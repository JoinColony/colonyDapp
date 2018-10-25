/* @flow */

import type { RecordFactory } from 'immutable';

import { Record, List } from 'immutable';

import type { TransactionProps } from '~types/TransactionRecord';

const defaultValues: TransactionProps = {
  actionType: undefined,
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  hash: undefined,
  id: '',
  options: undefined,
  params: undefined,
  receiptReceived: undefined,
};

const Transaction: RecordFactory<TransactionProps> = Record(defaultValues);

export default Transaction;
