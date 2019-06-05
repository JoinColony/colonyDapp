/* @flow */

import type {
  ErrorActionType,
  ActionType,
  ActionTypeWithPayload,
} from '../index';

import { ACTIONS } from '../../index';

export type InboxActionTypes = {|
  INBOX_MARK_NOTIFICATION_READ: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_READ,
    {| id: string, timestamp: number |},
  >,
  INBOX_MARK_NOTIFICATION_READ_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_READ_ERROR,
    void,
  >,
  INBOX_MARK_NOTIFICATION_READ_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
    {| readUntil: number, exceptFor: string[] |},
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_READ: ActionType<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ,
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
    void,
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
    {| readUntil: number, exceptFor: string[] |},
  >,
|};
