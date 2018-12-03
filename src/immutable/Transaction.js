/* @flow */

import type { RecordFactory } from 'immutable';

import { Record, List } from 'immutable';
import nanoid from 'nanoid';

import type { TransactionProps } from '~types';

const defaultValues: TransactionProps<*, *> = {
  context: undefined,
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  hash: undefined,
  id: nanoid(),
  identifier: undefined,
  lifecycle: {},
  methodName: '',
  options: {},
  params: {},
  receiptReceived: undefined,
  suggestedGasLimit: undefined,
  suggestedGasPrice: undefined,
};

const Transaction: RecordFactory<TransactionProps<*, *>> = Record(
  defaultValues,
);

export default Transaction;
