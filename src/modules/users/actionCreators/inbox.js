/* @flow */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const markNotification = (
  readUntil: string,
  exceptFor: string[],
): Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION> => ({
  type: ACTIONS.INBOX_MARK_NOTIFICATION,
  payload: { readUntil, exceptFor },
});

export const markAllNotifications = (
  readUntil: string,
  exceptFor: string[],
): Action<typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS> => ({
  type: ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
  payload: { readUntil, exceptFor },
});
