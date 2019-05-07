/* @flow */

import messages from './messages';

export type InboxEvent = $Keys<typeof messages>;

export type EventType = 'action' | 'notification';

// Handle read/unread notifications
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
  colonyAddress?: String,
  comment?: string,
  domainName?: string,
  domainId?: Number,
  dueDate?: Date,
  onClickRoute?: string,
  sourceUserAddress?: string,
  targetUserAddress?: string,
  taskTitle?: string,
};
