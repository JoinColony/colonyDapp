/* @flow */

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';
import type { EventReducer } from '~data/types';

import { USER_EVENT_TYPES } from '~data/constants';

const {
  SUBSCRIBED_TO_TASK,
  TOKEN_ADDED,
  TOKEN_REMOVED,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

export const getUserTasksReducer: EventReducer<
  [Address, TaskDraftId][],
  {|
    SUBSCRIBED_TO_TASK: *,
    UNSUBSCRIBED_FROM_TASK: *,
  |},
> = (userTasks, event) => {
  switch (event.type) {
    case SUBSCRIBED_TO_TASK: {
      const { colonyAddress, draftId } = event.payload;
      return [...userTasks, [colonyAddress, draftId]];
    }
    case UNSUBSCRIBED_FROM_TASK: {
      return userTasks.filter(
        ([colonyAddress, draftId]) =>
          colonyAddress === event.payload.colonyAddress &&
          draftId === event.payload.draftId,
      );
    }
    default:
      return userTasks;
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
