/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import nanoid from 'nanoid';
import { Record } from 'immutable';

export type MessageProps = {
  id: string,
  createdAt: Date,
  message: string,
  signature?: string,
  status: 'created' | 'pending' | 'failed' | 'succeeded',
};

const defaultValues: $Shape<MessageProps> = {
  id: `${nanoid(10)}-signMessage`,
  createdAt: new Date(),
  message: undefined,
  signature: undefined,
  status: 'created',
};

const MessageRecord: RecordFactory<MessageProps> = Record(defaultValues);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
