/* @flow */

import messages from './messages';

export type InboxEvent = $Keys<typeof messages>;

export type EventType = 'action' | 'notification';

export type InboxElement = {
  id: number,
  event: InboxEvent,
  createdAt: Date,
  unread: boolean,

  /* present depending on event */
  colonyName?: string,
  domainName?: string,
  taskName?: string,
  amount?: {
    unit: string,
    value: number,
  },
  user?: {
    walletAddress: string,
    username: string,
  },
  otherUser?: string,
  comment?: string,
  dueDate?: Date,
  onClickRoute?: string,
};
