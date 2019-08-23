import { List as ListType, List, fromJS } from 'immutable';

import { InboxItemRecord, InboxItemRecordType } from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

const inboxItemsReducer: ReducerType<ListType<InboxItemRecordType>> = (
  state = List(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.INBOX_ITEMS_ADD_SUCCESS: {
      const { activity } = action.payload;
      const {
        type,
        meta: { id, actorId, sourceType, sourceId, timestamp },
        payload: { sourceUserAddress },
        payload: context,
      } = activity as any;
      return state.push(
        InboxItemRecord(
          fromJS({
            id,
            timestamp,
            type,
            sourceType,
            sourceId,
            sourceAddress: sourceUserAddress || actorId,
            context,
          }),
        ),
      );
    }
    case ActionTypes.INBOX_ITEMS_FETCH_SUCCESS: {
      const { activities } = action.payload;
      return List(
        activities.map(
          ({
            type,
            meta: { id, actorId, sourceType, sourceId, timestamp },
            payload: { sourceUserAddress },
            payload: context,
          }: any) =>
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
      );
    }
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return List();
    default:
      return state;
  }
};

export default inboxItemsReducer;
