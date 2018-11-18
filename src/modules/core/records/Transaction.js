/* @flow */

import type { RecordFactory } from 'immutable';

import { Record, List } from 'immutable';
import nanoid from 'nanoid';

import type { TransactionProps } from '~types/TransactionRecord';

const defaultValues: TransactionProps<*, *> = {
  contextName: '',
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  hash: undefined,
  id: nanoid(),
  lifecycleActionTypes: {},
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
