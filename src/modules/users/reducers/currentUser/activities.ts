import { List } from 'immutable';

import {
  DataRecord,
  DataRecordType,
  InboxItemRecord,
  InboxItemRecordType,
} from '~immutable/index';
import { ActionTypes } from '~redux/index';
import { withDataRecord } from '~utils/reducers';

const inboxItemsReducer = (
  state = DataRecord<List<InboxItemRecordType>>(),
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
              InboxItemRecord({
                id,
                timestamp,
                type,
                sourceId,
                sourceType,
                sourceAddress: sourceUserAddress || actorId,
                context,
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

export default withDataRecord<DataRecordType<List<InboxItemRecordType>>>(
  ActionTypes.INBOX_ITEMS_FETCH,
)(inboxItemsReducer);
