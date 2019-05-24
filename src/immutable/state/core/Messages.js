/* @flow */

import type {
  Map as ImmutableMapType,
  RecordFactory,
  RecordOf,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { MessageRecordType, TransactionId } from '~immutable';

export type MessagesList = ImmutableMapType<TransactionId, MessageRecordType>;

const defaultValues: MessagesList = ImmutableMap();

const CoreMessages: RecordFactory<MessagesList> = Record(defaultValues);

export type CoreMessagesRecord = RecordOf<MessagesList>;

export default CoreMessages;
