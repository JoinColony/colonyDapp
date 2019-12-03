import { Address } from '~types/index';
import { TaskDraftId } from '~immutable/index';
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
