/* @flow */

import type {
  ErrorActionType,
  ActionType,
  ActionTypeWithPayload,
} from '../index';

import { ACTIONS } from '../../index';

export type InboxActionTypes = {|
  INBOX_MARK_NOTIFICATION: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION,
    {| id: string, timestamp: number |},
  >,
  INBOX_MARK_NOTIFICATION_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_ERROR,
    void,
  >,
  INBOX_MARK_NOTIFICATION_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS,
    {| readUntil: number, exceptFor: string[] |},
  >,
  INBOX_MARK_ALL_NOTIFICATIONS: ActionType<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_ERROR,
    void,
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS,
    {| readUntil: number, exceptFor: string[] |},
  >,
|};
