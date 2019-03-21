/* @flow */

import { COLONY_EVENT_TYPES } from '../../constants';

import type { EventReducer } from '../../types';
import type { ColonyType, TokenType } from '~immutable';

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

export const colonyAvatarReducer: EventReducer<
  null | {| ipfsHash: string, avatar: string |},
  {| AVATAR_UPLOADED: *, AVATAR_REMOVED: * |},
> = (colony, event) => {
  switch (event.type) {
    case AVATAR_UPLOADED: {
      const { ipfsHash, avatar } = event.payload;
      return {
        ipfsHash,
        avatar,
      };
    }
    case AVATAR_REMOVED:
      return null;

    default:
      return colony;
  }
};

export const colonyReducer: EventReducer<
  {| colony: ColonyType, tokens: TokenType[] |},
  {|
    AVATAR_REMOVED: *,
    AVATAR_UPLOADED: *,
    PROFILE_CREATED: *,
    PROFILE_UPDATED: *,
    TOKEN_INFO_ADDED: *,
  |},
> = ({ colony, tokens }, event) => {
  switch (event.type) {
    case TOKEN_INFO_ADDED: {
      const { address, isNative, icon, name, symbol } = event.payload;
      const token = { address, isNative };
      return {
        colony: {
          ...colony,
          tokens: {
            ...colony.tokens,
            [address]: token,
          },
        },
        tokens: [...tokens, { ...token, icon, name, symbol }],
      };
    }
    case AVATAR_UPLOADED: {
      // TODO: Make avatar an object so we have the ipfsHash and data
      const { ipfsHash } = event.payload;
      return {
        colony: {
          ...colony,
          avatar: ipfsHash,
        },
        tokens,
      };
    }
    case AVATAR_REMOVED: {
      const { avatar } = colony;
      const { ipfsHash } = event.payload;
      return {
        colony: {
          ...colony,
          avatar: avatar && avatar === ipfsHash ? undefined : avatar,
        },
        tokens,
      };
    }
    case PROFILE_CREATED:
    case PROFILE_UPDATED:
      return { colony: { ...colony, ...event.payload }, tokens };
    default:
      return { colony, tokens };
  }
};
