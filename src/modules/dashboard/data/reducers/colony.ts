import { ColonyType } from '~immutable/index';
import { EventReducer } from '~data/types';
import { EventTypes } from '~data/constants';

export const colonyTasksReducer: EventReducer<{
  [draftId: string]: {
    commentsStoreAddress: string;
    taskStoreAddress: string;
  };
}> = (tasks, event) => {
  switch (event.type) {
    case EventTypes.TASK_STORE_REGISTERED: {
      const { commentsStoreAddress, draftId, taskStoreAddress } = event.payload;
      return {
        ...tasks,
        [draftId]: { commentsStoreAddress, taskStoreAddress },
      };
    }
    case EventTypes.TASK_STORE_UNREGISTERED: {
      const { draftId } = event.payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [draftId]: unregisteredTask, ...remainingTasks } = tasks;
      return { ...remainingTasks };
    }
    default:
      return tasks;
  }
};

export const colonyReducer: EventReducer<ColonyType> = (colony, event) => {
  switch (event.type) {
    case EventTypes.TOKEN_INFO_ADDED: {
      const { address } = event.payload;
      return {
        ...colony,
        tokens: {
          ...colony.tokens,
          [address]: event.payload,
        },
      };
    }
    case EventTypes.TOKEN_INFO_REMOVED: {
      const { address } = event.payload;
      return {
        ...colony,
        tokens: Object.entries(colony.tokens)
          .filter(([tokenAddress]) => tokenAddress !== address)
          .reduce(
            (acc, [tokenAddress, token]) => ({
              ...acc,
              [tokenAddress]: token,
            }),
            {},
          ),
      };
    }
    case EventTypes.COLONY_AVATAR_UPLOADED: {
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatarHash: ipfsHash,
      };
    }
    case EventTypes.COLONY_AVATAR_REMOVED: {
      const { avatarHash } = colony;
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatarHash:
          avatarHash && avatarHash === ipfsHash ? undefined : avatarHash,
      };
    }
    case EventTypes.COLONY_PROFILE_CREATED:
    case EventTypes.COLONY_PROFILE_UPDATED:
      return { ...colony, ...event.payload };
    default:
      return colony;
  }
};
