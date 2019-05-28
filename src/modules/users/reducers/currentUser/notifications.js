/* @flow */

import { ACTIONS } from '~redux';
import { UserNotificationMetadataRecord } from '~immutable';

import type { UserNotificationMetadataRecordType } from '~immutable';
import type { ReducerType } from '~redux';

type State = UserNotificationMetadataRecordType;
type Actions = {
  INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS: *,
  INBOX_MARK_NOTIFICATION_SUCCESS: *,
  USER_NOTIFICATION_METADATA_FETCH_SUCCESS: *,
};

const currentUserNotificationsReducer: ReducerType<State, Actions> = (
  state = UserNotificationMetadataRecord(),
  action,
) => {
  switch (action.type) {
    case ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS_SUCCESS:
    case ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS:
    case ACTIONS.USER_NOTIFICATION_METADATA_FETCH_SUCCESS: {
      const { readUntil, exceptFor } = action.payload;
      return UserNotificationMetadataRecord({ readUntil, exceptFor });
    }
    case ACTIONS.USER_LOGOUT_SUCCESS: {
      return state.clear();
    }
    default:
      return state;
  }
};

export default currentUserNotificationsReducer;
