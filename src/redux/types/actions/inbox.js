/* @flow */

import type { ErrorActionType, ActionTypeWithPayload } from '../index';

import { ACTIONS } from '../../index';

export type InboxActionTypes = {|
  INBOX_MARK_NOTIFICATION: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION,
    {| readUntil: string, exceptFor: string[] |},
  >,
  INBOX_MARK_NOTIFICATION_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_ERROR,
    void,
  >,
  INBOX_MARK_NOTIFICATION_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS,
    {| readUntil: string, exceptFor: string[] |},
  >,
  INBOX_MARK_ALL_NOTIFICATIONS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS,
    {| readUntil: string, exceptFor: string[] |},
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_ERROR,
    void,
  >,
  INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS,
    {| readUntil: string, exceptFor: string[] |},
  >,
|};
