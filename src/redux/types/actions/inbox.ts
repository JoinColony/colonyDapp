import { ErrorActionType, ActionType, ActionTypeWithPayload } from './index';

import { ActionTypes } from '../../index';

export type InboxActionTypes =
  | ActionTypeWithPayload<
      ActionTypes.INBOX_MARK_NOTIFICATION_READ,
      { id: string; timestamp: number }
    >
  | ErrorActionType<ActionTypes.INBOX_MARK_NOTIFICATION_READ_ERROR, void>
  | ActionTypeWithPayload<
      ActionTypes.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
      { readUntil: number; exceptFor: string[] }
    >
  | ActionType<ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ>
  | ErrorActionType<ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR, void>
  | ActionTypeWithPayload<
      ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
      { readUntil: number; exceptFor: string[] }
    >;
