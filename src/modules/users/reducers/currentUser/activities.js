/* @flow */

import type { List as ListType } from 'immutable';

import { List } from 'immutable';

import { InboxItemRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { InboxItemRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const inboxItemsReducer: ReducerType<
  ListType<InboxItemRecordType>,
  {|
    INBOX_ITEMS_FETCH_SUCCESS: *,
    INBOX_ITEMS_ADD_SUCCESS: *,
  |},
> = (state = List(), action) => {
  switch (action.type) {
    case ACTIONS.INBOX_ITEMS_ADD_SUCCESS: {
      const { activity } = action.payload;
      const {
        type,
        meta: { id, actorId, targetId, timestamp },
        payload: context,
      } = activity;
      return state.push(
        InboxItemRecord({
          id,
          timestamp: new Date(timestamp),
          type,
          sourceUserAddress: actorId,
          targetUserAddress: targetId,
          context,
        }),
      );
    }
    case ACTIONS.INBOX_ITEMS_FETCH_SUCCESS: {
      const { activities } = action.payload;
      return List(
        activities.map(
          ({
            type,
            meta: { id, actorId, targetId, timestamp },
            payload: context,
          }) =>
            InboxItemRecord({
              id,
              timestamp: new Date(timestamp),
              type,
              sourceUserAddress: actorId,
              targetUserAddress: targetId,
              context,
            }),
        ),
      );
    }
    case ACTIONS.USER_LOGOUT_SUCCESS: {
      return List();
    }
    default:
      return state;
  }
};

export default inboxItemsReducer;
