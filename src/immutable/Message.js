/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import nanoid from 'nanoid';
import { Record } from 'immutable';

export type MessageProps = {
  id: string,
  createdAt: Date,
  /*
   * Why is the message signature required, so we can attach a message
   * descriptor id to it and show a prettier name
   */
  purpose: string,
  message: string,
  signature?: string,
  status: 'created' | 'pending' | 'failed' | 'succeeded',
};

const defaultValues: $Shape<MessageProps> = {
  id: `${nanoid(10)}-signMessage`,
  createdAt: new Date(),
  purpose: 'generic',
  message: undefined,
  signature: undefined,
  status: 'created',
};

const MessageRecord: RecordFactory<MessageProps> = Record(defaultValues);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
