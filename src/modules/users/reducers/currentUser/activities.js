/* @flow */

import type { List as ListType } from 'immutable';

import { List } from 'immutable';

import { UserActivityRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserActivityRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const currentUserActivitiesReducer: ReducerType<
  ListType<UserActivityRecordType>,
  {|
    USER_ACTIVITIES_FETCH_SUCCESS: *,
    USER_ACTIVITIES_ADD_SUCCESS: *,
    INBOX_MARK_NOTIFICATION_SUCCESS: *,
  |},
> = (state = List(), action) => {
  switch (action.type) {
    case ACTIONS.USER_ACTIVITIES_ADD_SUCCESS: {
      const { activity } = action.payload;
      return state.push(UserActivityRecord(activity));
    }
    case ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS: {
      const { activities } = action.payload;
      return List(activities.map(activity => UserActivityRecord(activity)));
    }
    case ACTIONS.INBOX_MARK_NOTIFICATION: {
      const { id } = action.payload;
      /* Find activity by id and set unread
        boolean in a list of activities
      */
      let listIndex = 0;
      const activityToUpdate = state.toArray().find((act, indexInList) => {
        if (act.get('id') === id) {
          listIndex = indexInList;
          return act;
        }
        return undefined;
      });
      const newRecord = UserActivityRecord(activityToUpdate);

      const updatedActivityRecord = newRecord.set('unread', false);
      return state.set(listIndex, updatedActivityRecord);
    }
    case ACTIONS.INBOX_MARK_ALL_NOTIFICATIONS: {
      return List(
        state.map(activity => {
          const activityRecord = UserActivityRecord(activity);
          const updatedRecord = activityRecord.set('unread', false);
          return updatedRecord;
        }),
      );
    }
    default:
      return state;
  }
};

export default currentUserActivitiesReducer;
