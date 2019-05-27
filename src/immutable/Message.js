/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type MessageId = string;

export type MessageProps = {
  id: MessageId,
  message: string,
  signature?: string,
};

const defaultValues: $Shape<MessageProps> = {
  id: undefined,
  message: undefined,
  signature: undefined,
};

const MessageRecord: RecordFactory<MessageProps> = Record(defaultValues);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
