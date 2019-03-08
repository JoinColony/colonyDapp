/* @flow */

import { USER_EVENT_TYPES } from '../../constants';

import type { EventReducer } from '../../types';

const { SUBSCRIBED_TO_TASK, UNSUBSCRIBED_FROM_TASK } = USER_EVENT_TYPES;

// eslint-disable-next-line import/prefer-default-export
export const getUserTasksReducer: EventReducer<
  string[],
  {|
    SUBSCRIBED_TO_TASK: *,
    UNSUBSCRIBED_FROM_TASK: *,
  |},
> = (userTasks, event) => {
  switch (event.type) {
    case SUBSCRIBED_TO_TASK: {
      const { draftId } = event.payload;
      return [...userTasks, draftId];
    }
    case UNSUBSCRIBED_FROM_TASK: {
      const { draftId } = event.payload;
      return userTasks.filter(userTaskId => userTaskId !== draftId);
    }
    default:
      return userTasks;
  }
};
