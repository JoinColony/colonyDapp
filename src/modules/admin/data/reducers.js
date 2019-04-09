/* @flow */

import type { ColonyType } from '~immutable';
import type { EventReducer } from '~data/types';

import { COLONY_EVENT_TYPES } from '~data/constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  PROFILE_CREATED,
  PROFILE_UPDATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

export const colonyTasksReducer: EventReducer<
  {
    [draftId: string]: {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
    |},
  },
  {|
    TASK_STORE_REGISTERED: *,
    TASK_STORE_UNREGISTERED: *,
  |},
> = (tasks, event) => {
  switch (event.type) {
    case TASK_STORE_REGISTERED: {
      const { commentsStoreAddress, draftId, taskStoreAddress } = event.payload;
      return Object.assign({}, tasks, {
        [draftId]: { commentsStoreAddress, taskStoreAddress },
      });
    }
    case TASK_STORE_UNREGISTERED: {
      const { draftId } = event.payload;
      const { [draftId]: unregisteredTask, ...remainingTasks } = tasks;
      return Object.assign({}, remainingTasks);
    }
    default:
      return tasks;
  }
};

export const colonyReducer: EventReducer<
  ColonyType,
  {|
    AVATAR_REMOVED: *,
    AVATAR_UPLOADED: *,
    PROFILE_CREATED: *,
    PROFILE_UPDATED: *,
    TOKEN_INFO_ADDED: *,
  |},
> = (colony, event) => {
  switch (event.type) {
    case TOKEN_INFO_ADDED: {
      const { address } = event.payload;
      return {
        ...colony,
        tokens: {
          ...colony.tokens,
          [address]: event.payload,
        },
      };
    }
    case AVATAR_UPLOADED: {
      // TODO: Make avatar an object so we have the ipfsHash and data
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatar: ipfsHash,
      };
    }
    case AVATAR_REMOVED: {
      const { avatar } = colony;
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatar: avatar && avatar === ipfsHash ? undefined : avatar,
      };
    }
    case PROFILE_CREATED:
    case PROFILE_UPDATED:
      return { ...colony, ...event.payload };
    default:
      return colony;
  }
};
