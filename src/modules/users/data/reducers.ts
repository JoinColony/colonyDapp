import { Address } from '~types/index';
import { TaskDraftId, UserProfileType } from '~immutable/index';
import { EventReducer } from '~data/types';

import { EventTypes } from '~data/constants';

export const getUserTasksReducer: EventReducer<[Address, TaskDraftId][]> = (
  userTasks,
  event,
) => {
  switch (event.type) {
    case EventTypes.SUBSCRIBED_TO_TASK: {
      const { colonyAddress, draftId } = event.payload;
      return [...userTasks, [colonyAddress, draftId]];
    }
    case EventTypes.UNSUBSCRIBED_FROM_TASK: {
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
export const getUserProfileReducer: EventReducer<UserProfileType> = (
  userProfile,
  event,
) => {
  switch (event.type) {
    case EventTypes.USER_PROFILE_CREATED:
    case EventTypes.USER_PROFILE_UPDATED:
    case EventTypes.USER_AVATAR_UPLOADED:
      return {
        ...userProfile,
        ...event.payload,
      };

    case EventTypes.USER_AVATAR_REMOVED: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatarHash, ...rest } = userProfile;
      return rest;
    }

    default:
      return userProfile;
  }
};

export const getUserTokensReducer: EventReducer<Address[]> = (
  userTokens,
  event,
) => {
  switch (event.type) {
    case EventTypes.TOKEN_ADDED: {
      const { address } = event.payload;
      return [...userTokens, address];
    }
    case EventTypes.TOKEN_REMOVED: {
      const { address } = event.payload;
      return userTokens.filter(tokenAddress => tokenAddress !== address);
    }
    default:
      return userTokens;
  }
};
