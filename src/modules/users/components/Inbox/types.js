/* @flow */

import messages from './messages';

export type InboxEvent = $Keys<typeof messages>;

export type EventType = 'action' | 'notification';

/*
 * @TODO Handle read/unread notifications
 */
export type InboxElement = {
  id: string,
  timestamp: Date,
  event: InboxEvent,
  // unread: boolean,

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
  task?: string,
  userAddress?: string,
};
