import { $ReadOnly } from 'utility-types';
import { Record } from 'immutable';

import { DefaultValues } from '~types/index';

import { TRANSACTION_STATUSES } from './Transaction';

interface Shared {
  id: string;
  createdAt?: Date;

  /*
   * Why is the message signature required, so we can attach a message
   * descriptor id to it and show a prettier name
   */
  purpose?: string;
  message: string;
  signature?: string;
  status?: TRANSACTION_STATUSES;
}

export type MessageType = $ReadOnly<Shared>;

const defaultValues: DefaultValues<Shared> = {
  id: undefined,
  createdAt: new Date(),
  purpose: 'generic',
  message: undefined,
  signature: undefined,
  status: TRANSACTION_STATUSES.CREATED,
};

export class MessageRecord extends Record<Shared>(defaultValues) {}

export const Message = (p: Shared) => new MessageRecord(p);
