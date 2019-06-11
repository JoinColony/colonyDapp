/* @flow */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const markNotificationAsRead = (
  id: string,
  timestamp: number,
): Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION_READ> => ({
  type: ACTIONS.INBOX_MARK_NOTIFICATION_READ,
  payload: { id, timestamp },
});

export const markAllNotificationsAsRead = (): Action<
  typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ,
> => ({
  type: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ,
});
