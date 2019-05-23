/* @flow */

import type { List as ListType } from 'immutable';

import { List } from 'immutable';

import { UserActivityRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserActivityRecordType } from '~immutable';
import type { ReducerType } from '~redux';

import { activityByIdSelector } from '../../selectors';

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
    case ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS: {
      const { id } = action.payload;
      // find activity by id and set unread boolean
      const activity = activityByIdSelector(state, id);
      return activity.set('unread', false);
    }
    default:
      return state;
  }
};

export default currentUserActivitiesReducer;
