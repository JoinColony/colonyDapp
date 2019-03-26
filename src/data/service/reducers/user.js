/* @flow */

import { USER_EVENT_TYPES } from '../../constants';

import type { EventReducer } from '../../types';

const {
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

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

export const getUserColoniesReducer: EventReducer<
  string[],
  {|
    SUBSCRIBED_TO_COLONY: *,
    UNSUBSCRIBED_FROM_COLONY: *,
  |},
> = (userColonies, event) => {
  switch (event.type) {
    case SUBSCRIBED_TO_COLONY: {
      const { address } = event.payload;
      return [...userColonies, address];
    }
    case UNSUBSCRIBED_FROM_COLONY: {
      const { address } = event.payload;
      return userColonies.filter(colonyAddress => colonyAddress !== address);
    }
    default:
      return userColonies;
  }
};
