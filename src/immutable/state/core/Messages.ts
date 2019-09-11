import { RecordOf, Record, Map as ImmutableMap } from 'immutable';

import { MessageRecord, TransactionId } from '~immutable/index';

export type MessagesList = ImmutableMap<TransactionId, MessageRecord>;

export interface CoreMessagesProps {
  list: MessagesList;
}

const defaultValues: Partial<CoreMessagesProps> = {
  list: ImmutableMap(),
};

export const CoreMessages: Record.Factory<Partial<CoreMessagesProps>> = Record(
  defaultValues,
);

export type CoreMessagesRecord = RecordOf<Partial<CoreMessagesProps>>;
