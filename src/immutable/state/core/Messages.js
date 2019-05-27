/* @flow */

import type {
  Map as ImmutableMapType,
  RecordFactory,
  RecordOf,
} from 'immutable';

import { Record, Map as ImmutableMap } from 'immutable';

import type { MessageRecordType, TransactionId } from '~immutable';

export type MessagesList = ImmutableMapType<TransactionId, MessageRecordType>;

export type CoreMessagesProps = {|
  list: MessagesList,
|};

const defaultValues: $Shape<CoreMessagesProps> = {
  // [CORE_TRANSACTIONS_LIST]: ImmutableMap(),
  list: ImmutableMap(),
};

const CoreMessages: RecordFactory<CoreMessagesProps> = Record(defaultValues);

export type CoreMessagesRecord = RecordOf<CoreMessagesProps>;

export default CoreMessages;
