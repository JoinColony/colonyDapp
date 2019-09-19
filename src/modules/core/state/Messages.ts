import { Record, Map as ImmutableMap } from 'immutable';

import { MessageRecord, TransactionId } from '~immutable/index';
import { DefaultValues } from '~types/index';

import { CORE_MESSAGES_LIST } from '../../../modules/core/constants';

export type MessagesList = ImmutableMap<TransactionId, MessageRecord>;

export interface CoreMessagesProps {
  [CORE_MESSAGES_LIST]: MessagesList;
}

const defaultValues: DefaultValues<CoreMessagesProps> = {
  [CORE_MESSAGES_LIST]: ImmutableMap(),
};

export class CoreMessagesRecord extends Record<CoreMessagesProps>(
  defaultValues,
) {}

export const CoreMessages = (p?: CoreMessagesProps) =>
  new CoreMessagesRecord(p);
