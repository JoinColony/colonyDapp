import { Address, WithKey } from '~types/index';
import {
  ContractTransactionType,
  TaskDraftId,
  TokenReferenceType,
  UserProfileType,
} from '~immutable/index';

import {
  ActionType,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from './index';

import { ActionTypes } from '../../index';

export type UserActionTypes =
  | UniqueActionType<ActionTypes.USER_AVATAR_REMOVE, object, object>
  | ErrorActionType<ActionTypes.USER_AVATAR_REMOVE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
      { address: Address },
      object
    >
  | UniqueActionType<ActionTypes.USER_AVATAR_UPLOAD, { data: string }, object>
  | ErrorActionType<ActionTypes.USER_AVATAR_UPLOAD_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
      {
        address: Address;
        avatar: string;
        hash: string;
      },
      object
    >
  | UniqueActionType<
      ActionTypes.USER_ADDRESS_FETCH,
      { username: string },
      object
    >
  | ErrorActionType<ActionTypes.USER_ADDRESS_FETCH_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_ADDRESS_FETCH_SUCCESS,
      { userAddress: string },
      object
    >
  | UniqueActionType<
      ActionTypes.USER_COLONY_SUBSCRIBE,
      { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.USER_COLONY_SUBSCRIBE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_COLONY_SUBSCRIBE_SUCCESS,
      { colonyAddress: Address; walletAddress: Address },
      object
    >
  | UniqueActionType<
      ActionTypes.USER_COLONY_UNSUBSCRIBE,
      { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.USER_COLONY_UNSUBSCRIBE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_COLONY_UNSUBSCRIBE_SUCCESS,
      { colonyAddress: Address; walletAddress: Address },
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_FETCH,
      { userAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_FETCH_SUCCESS,
      UserProfileType,
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_NOTIFICATION_METADATA_FETCH,
      { readUntil: number; exceptFor: string[] },
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_NOTIFICATION_METADATA_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_NOTIFICATION_METADATA_FETCH_SUCCESS,
      { readUntil: number; exceptFor: string[] }
    >

  // In the future we could specify in the payload which permission(s) we would like to fetch
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_PERMISSIONS_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_PERMISSIONS_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_PERMISSIONS_FETCH_SUCCESS,
      {
        colonyAddress: Address;
        permissions: { readonly canEnterRecoveryMode?: boolean };
      },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.USER_PROFILE_UPDATE,
      {
        bio?: string;
        displayName?: string;
        location?: string;
        website?: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.USER_PROFILE_UPDATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.USER_PROFILE_UPDATE_SUCCESS,
      UserProfileType,
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH,
      { walletAddress: Address; metadataStoreAddress: string },
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUBSCRIBED_COLONIES_FETCH_SUCCESS,
      { colonyAddresses: Address[]; walletAddress: Address },
      WithKey
    >
  | ActionType<ActionTypes.USER_SUBSCRIBED_TASKS_FETCH>
  | ErrorActionType<ActionTypes.USER_SUBSCRIBED_TASKS_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_SUBSCRIBED_TASKS_FETCH_SUCCESS,
      [Address, TaskDraftId][]
    >
  | ActionTypeWithPayload<
      ActionTypes.USER_TASK_SUBSCRIBE,
      { colonyAddress: Address; draftId: TaskDraftId }
    >
  | ErrorActionType<ActionTypes.USER_TASK_SUBSCRIBE_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_TASK_SUBSCRIBE_SUCCESS,
      { colonyAddress: Address; draftId: TaskDraftId }
    >
  | ActionType<ActionTypes.USER_TOKEN_TRANSFERS_FETCH>
  | ErrorActionType<ActionTypes.USER_TOKEN_TRANSFERS_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS,
      {
        transactions: ContractTransactionType[];
      }
    >
  | ActionType<ActionTypes.USER_TOKENS_FETCH>
  | ErrorActionType<ActionTypes.USER_TOKENS_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.USER_TOKENS_FETCH_SUCCESS,
      {
        tokens: TokenReferenceType[];
      }
    >
  | ActionTypeWithPayload<
      ActionTypes.USER_TOKENS_UPDATE,
      {
        tokens: Address[];
      }
    >
  | ErrorActionType<ActionTypes.USER_TOKENS_UPDATE_ERROR, object>
  | ActionType<ActionTypes.USER_TOKENS_UPDATE_SUCCESS>
  | ActionType<ActionTypes.USER_LOGOUT>
  | ErrorActionType<ActionTypes.USER_LOGOUT_ERROR, object>
  | ActionType<ActionTypes.USER_LOGOUT_SUCCESS>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUB_START,
      { userAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUB_STOP,
      { userAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUB_EVENTS,
      UserProfileType,
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_SUB_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_START,
      { walletAddress: Address; metadataStoreAddress: string },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_STOP,
      { walletAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_EVENTS,
      {
        colonyAddresses: Address[];
        walletAddress: Address;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.USER_SUBSCRIBED_COLONIES_SUB_ERROR, WithKey>
  | ActionType<ActionTypes.USER_SUBSCRIBED_TASKS_SUB_START>
  | ActionType<ActionTypes.USER_SUBSCRIBED_TASKS_SUB_STOP>
  | ActionTypeWithPayload<
      ActionTypes.USER_SUBSCRIBED_TASKS_SUB_EVENTS,
      [Address, TaskDraftId][]
    >
  | ErrorActionType<ActionTypes.USER_SUBSCRIBED_TASKS_SUB_ERROR, null>;
