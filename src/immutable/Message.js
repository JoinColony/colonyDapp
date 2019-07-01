/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import type { TransactionStatusType } from '~immutable/Transaction';

import { Record } from 'immutable';
import { TRANSACTION_STATUSES } from '~immutable/Transaction';

export type MessageProps = $ReadOnly<{|
  id: string,
  createdAt: Date,
  /*
   * Why is the message signature required, so we can attach a message
   * descriptor id to it and show a prettier name
   */
  purpose: string,
  message: string,
  signature?: string,
  status: TransactionStatusType,
|}>;

const defaultValues: $Shape<MessageProps> = {
  id: undefined,
  createdAt: new Date(),
  purpose: 'generic',
  message: undefined,
  signature: undefined,
  status: TRANSACTION_STATUSES.CREATED,
};

const MessageRecord: RecordFactory<MessageProps> = Record(defaultValues);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
