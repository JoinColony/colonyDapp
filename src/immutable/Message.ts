import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { TransactionStatusType, TRANSACTION_STATUSES } from './Transaction';

export type MessageProps = $ReadOnly<{
  id: string;
  createdAt: Date;

  /*
   * Why is the message signature required, so we can attach a message
   * descriptor id to it and show a prettier name
   */
  purpose: string;
  message: string;
  signature?: string;
  status: TransactionStatusType;
}>;

const defaultValues: Partial<MessageProps> = {
  id: undefined,
  createdAt: new Date(),
  purpose: 'generic',
  message: undefined,
  signature: undefined,
  status: TRANSACTION_STATUSES.CREATED,
};

export const MessageRecord: Record.Factory<Partial<MessageProps>> = Record(
  defaultValues,
);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
