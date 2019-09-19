import { ActionTypes, ReducerType } from '~redux/index';
import {
  UserNotificationMetadata,
  UserNotificationMetadataRecord,
} from '~immutable/index';

const currentUserNotificationsReducer: ReducerType<
  UserNotificationMetadataRecord
> = (state = UserNotificationMetadata(), action) => {
  switch (action.type) {
    case ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
    case ActionTypes.INBOX_MARK_NOTIFICATION_READ_SUCCESS:
    case ActionTypes.USER_NOTIFICATION_METADATA_FETCH_SUCCESS: {
      const { readUntil, exceptFor } = action.payload;
      return UserNotificationMetadata({ readUntil, exceptFor });
    }
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return state.clear();
    default:
      return state;
  }
};

export default currentUserNotificationsReducer;
