import { List } from 'immutable';

import {
  FetchableData,
  FetchableDataRecord,
  InboxItem,
  InboxItemRecord,
} from '~immutable/index';
import { ActionTypes } from '~redux/index';
import { withFetchableData } from '~utils/reducers';

const inboxItemsReducer = (
  state = FetchableData<List<InboxItemRecord>>(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.INBOX_ITEMS_FETCH_SUCCESS: {
      const { activities, currentUser } = action.payload;
      return state.set(
        'record',
        List(
          activities.map(
            ({
              id,
              event: {
                type,
                createdAt: timestamp,
                initiatorAddress: initiator,
                sourceId,
                sourceType,
                context
              },
              read,
            }) =>
              InboxItem({
                id,
                timestamp,
                type,
                sourceId,
                sourceType,
                initiator,
                context,
                targetUser: context.targetUserAddress || currentUser,
                unread: !read,
              }),
          ),
        ),
      );
    }
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return state.set('record', List());
    default:
      return state;
  }
};

export default withFetchableData<FetchableDataRecord<List<InboxItemRecord>>>(
  ActionTypes.INBOX_ITEMS_FETCH,
)(inboxItemsReducer);
