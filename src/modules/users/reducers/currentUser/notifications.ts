import { ActionTypes, ReducerType } from '~redux/index';
import {
  UserNotificationMetadataRecord,
  UserNotificationMetadataRecordType,
} from '~immutable/index';

type State = UserNotificationMetadataRecordType;

const currentUserNotificationsReducer: ReducerType<State> = (
  state = UserNotificationMetadataRecord(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS:
    case ActionTypes.INBOX_MARK_NOTIFICATION_READ_SUCCESS:
    case ActionTypes.USER_NOTIFICATION_METADATA_FETCH_SUCCESS: {
      const { readUntil, exceptFor } = action.payload;
      return UserNotificationMetadataRecord({ readUntil, exceptFor });
    }
    case ActionTypes.USER_LOGOUT_SUCCESS: {
      return state.clear();
    }
    default:
      return state;
  }
};

export default currentUserNotificationsReducer;
