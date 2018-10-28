/* @flow */

import type { RecordOf, List } from 'immutable';

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData',
  message: string,
};

export type TransactionId = string;

export type TransactionProps = {
  actionType?: string,
  createdAt: Date,
  errors: List<TransactionError>,
  eventData?: Object,
  hash?: string,
  id: TransactionId,
  options?: Object,
  params?: Object,
  receiptReceived?: boolean,
};

export type TransactionRecord = RecordOf<TransactionProps>;
