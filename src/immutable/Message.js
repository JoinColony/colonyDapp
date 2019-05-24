/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Record } from 'immutable';

export type MessageProps = {
  message: string,
  signature?: string,
};

const defaultValues: $Shape<MessageProps> = {
  message: undefined,
  signature: undefined,
};

const MessageRecord: RecordFactory<MessageProps> = Record(defaultValues);

export type MessageRecordType = RecordOf<MessageProps>;

export default MessageRecord;
