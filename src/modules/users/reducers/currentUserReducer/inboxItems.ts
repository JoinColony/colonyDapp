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
      const { activities } = action.payload;
      return state.set(
        'record',
        List(
          activities.map(
            ({
              type,
              meta: { id, actorId, sourceType, sourceId, timestamp },
              payload: { sourceUserAddress },
              payload: context,
            }) =>
              InboxItem({
                id,
                timestamp,
                type,
                sourceId,
                sourceType,
                initiator: sourceUserAddress || actorId,
                context,
                targetUser: context.targetUserAddress,
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
