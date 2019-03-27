/* @flow */

import { USER_EVENT_TYPES } from '../../constants';

import type { EventReducer } from '../../types';

const {
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  TOKEN_ADDED,
  TOKEN_REMOVED,
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

export const getUserTokensReducer: EventReducer<
  string[],
  {|
    TOKEN_ADDED: *,
    TOKEN_REMOVED: *,
  |},
> = (userTokens, event) => {
  switch (event.type) {
    case TOKEN_ADDED: {
      const { address } = event.payload;
      return [...userTokens, address];
    }
    case TOKEN_REMOVED: {
      const { address } = event.payload;
      return userTokens.filter(
        tokenAddress => tokenAddress.toLowerCase() !== address.toLowerCase(),
      );
    }
    default:
      return userTokens;
  }
};
