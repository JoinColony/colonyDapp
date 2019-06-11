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
      return state.push(InboxItemRecord(activity));
    }
    case ACTIONS.INBOX_ITEMS_FETCH_SUCCESS: {
      const { activities } = action.payload;
      return List(activities.map(activity => InboxItemRecord(activity)));
    }
    default:
      return state;
  }
};

export default inboxItemsReducer;
