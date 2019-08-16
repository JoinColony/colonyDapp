import { AllActions, ActionTypes } from '~redux/index';

export const markNotificationAsRead = (
  id: string,
  timestamp: number,
): AllActions => ({
  type: ActionTypes.INBOX_MARK_NOTIFICATION_READ,
  payload: { id, timestamp },
});

export const markAllNotificationsAsRead = (): AllActions => ({
  type: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ,
});
