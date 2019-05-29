/* @flow */

import type { Address } from '~types';
import type { TaskDraftId, UserProfileType } from '~immutable';
import type { EventReducer } from '~data/types';

import { USER_EVENT_TYPES, USER_PROFILE_EVENT_TYPES } from '~data/constants';

const {
  SUBSCRIBED_TO_TASK,
  TOKEN_ADDED,
  TOKEN_REMOVED,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

const {
  USER_AVATAR_REMOVED,
  USER_AVATAR_UPLOADED,
  USER_PROFILE_CREATED,
  USER_PROFILE_UPDATED,
} = USER_PROFILE_EVENT_TYPES;

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
export const getUserProfileReducer: EventReducer<
  UserProfileType,
  {|
    USER_AVATAR_REMOVED: *,
    USER_AVATAR_UPLOADED: *,
    USER_PROFILE_CREATED: *,
    USER_PROFILE_UPDATED: *,
  |},
> = (userProfile, event) => {
  switch (event.type) {
    case USER_PROFILE_CREATED:
    case USER_PROFILE_UPDATED:
    case USER_AVATAR_UPLOADED:
      return {
        ...userProfile,
        ...event.payload,
      };

    case USER_AVATAR_REMOVED: {
      const { avatarHash, ...rest } = userProfile;
      return rest;
    }

    default:
      return userProfile;
  }
};

export const getUserTokensReducer: EventReducer<
  Address[],
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
      return userTokens.filter(tokenAddress => tokenAddress !== address);
    }
    default:
      return userTokens;
  }
};
