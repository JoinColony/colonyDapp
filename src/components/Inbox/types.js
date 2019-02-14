/* @flow */

import messages from './messages';

export type InboxEvent = $Keys<typeof messages>;

export type EventType = 'action' | 'notification';

export type InboxElement = {
  id: number,
  createdAt: Date,
  event: InboxEvent,
  unread: boolean,

  /* present depending on event */
  amount?: {
    unit: string,
    value: number,
  },
  colonyName?: string,
  comment?: string,
  domainName?: string,
  dueDate?: Date,
  onClickRoute?: string,
  otherUser?: string,
  taskName?: string,
  user?: {
    walletAddress: string,
    username: string,
  },
};
