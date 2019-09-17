import { Record, Map as ImmutableMap } from 'immutable';

import { MessageRecord, TransactionId } from '~immutable/index';
import { DefaultValues } from '~types/index';

export type MessagesList = ImmutableMap<TransactionId, MessageRecord>;

export interface CoreMessagesProps {
  list?: MessagesList;
}

const defaultValues: DefaultValues<CoreMessagesProps> = {
  list: ImmutableMap(),
};

export class CoreMessagesRecord extends Record<CoreMessagesProps>(
  defaultValues,
) {}

export const CoreMessages = (p?: CoreMessagesProps) =>
  new CoreMessagesRecord(p);
