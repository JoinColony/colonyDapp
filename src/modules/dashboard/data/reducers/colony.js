/* @flow */

import type { ColonyType } from '~immutable';
import type { EventReducer } from '~data/types';

import { COLONY_EVENT_TYPES } from '~data/constants';

import { addressEquals } from '~utils/strings';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  PROFILE_CREATED,
  PROFILE_UPDATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
  TOKEN_INFO_ADDED,
  TOKEN_INFO_REMOVED,
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
    TOKEN_INFO_REMOVED: *,
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
    case TOKEN_INFO_REMOVED: {
      const { address } = event.payload;
      return {
        ...colony,
        tokens: Object.entries(colony.tokens)
          .filter(([tokenAddress]) => !addressEquals(tokenAddress, address))
          .reduce(
            (acc, [tokenAddress, token]) => ({
              ...acc,
              [tokenAddress]: token,
            }),
            {},
          ),
      };
    }
    case AVATAR_UPLOADED: {
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatarHash: ipfsHash,
      };
    }
    case AVATAR_REMOVED: {
      const { avatarHash } = colony;
      const { ipfsHash } = event.payload;
      return {
        ...colony,
        avatarHash:
          avatarHash && avatarHash === ipfsHash ? undefined : avatarHash,
      };
    }
    case PROFILE_CREATED:
    case PROFILE_UPDATED:
      return { ...colony, ...event.payload };
    default:
      return colony;
  }
};
