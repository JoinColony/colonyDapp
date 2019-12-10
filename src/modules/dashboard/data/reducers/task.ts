import BigNumber from 'bn.js';

import { EventReducer } from '~data/types';

import { EventTypes, TaskStates } from '~data/constants';

export const taskReducer: EventReducer<{
  commentsStoreAddress?: string;
  invites?: string[];
  requests?: string[];
  workerAddress?: string;
}> = (task, event) => {
  switch (event.type) {
    case EventTypes.COMMENT_STORE_CREATED: {
      const { commentsStoreAddress } = event.payload;
      return {
        ...task,
        commentsStoreAddress,
      };
    }
    case EventTypes.TASK_CREATED: {
      const {
        payload: { creatorAddress, domainId, draftId },
        meta: { timestamp },
      } = event;
      return {
        ...task,
        createdAt: new Date(timestamp),
        creatorAddress,
        managerAddress: creatorAddress, // @NOTE: At least for the draft version, the creator will also be the manager
        draftId,
        status: TaskStates.ACTIVE,
        domainId,
      };
    }

    default:
      return task;
  }
};
