/* @flow */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const markNotification = (
  id: string,
  timestamp: number,
): Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION> => ({
  type: ACTIONS.INBOX_MARK_NOTIFICATION,
  payload: { id, timestamp },
});

export const markAllNotifications = (): Action<
  typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
> => ({
  type: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
});
