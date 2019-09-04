import BigNumber from 'bn.js';

import { ActionTypes } from '~redux/index';
import { Address, ENSName, WithKey } from '~types/index';
import {
  ColonyType,
  ContractTransactionType,
  DomainType,
  TokenReferenceType,
} from '~immutable/index';
import {
  ActionType,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from './index';

export type ColonyActionTypes =
  | UniqueActionType<
      ActionTypes.COLONY_AVATAR_REMOVE,
      { user: Address; colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_AVATAR_REMOVE_ERROR, WithKey>
  | UniqueActionType<ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS, void, WithKey>
  | UniqueActionType<
      ActionTypes.COLONY_AVATAR_UPLOAD,
      { colonyAddress: Address; data: string },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_AVATAR_UPLOAD_ERROR, WithKey>
  | UniqueActionType<
      ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS,
      { hash: string },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<
      ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR,
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS,
      { canMintNativeToken: boolean; colonyAddress: Address },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_CLAIM_TOKEN,
      { tokenAddress: Address; colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_CLAIM_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_CLAIM_TOKEN_SUCCESS,
      { params: { token: Address } },
      object
    >
  | UniqueActionType<
      ActionTypes.COLONY_CREATE,
      {
        colonyName: string;
        displayName: string;
        tokenAddress?: Address;
        tokenChoice: 'create' | 'select';
        tokenIcon: string;
        tokenName: string;
        tokenSymbol: string;
        username: string;
      },
      object
    >
  | ActionType<typeof ActionTypes.COLONY_CREATE_CANCEL>
  | ErrorActionType<ActionTypes.COLONY_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.COLONY_CREATE_SUCCESS, void, object>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_DOMAINS_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_DOMAINS_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS,
      { colonyAddress: Address; domains: DomainType[] },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH,
      { colonyAddress: Address; domainId: number; userAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_DOMAIN_USER_ROLES_FETCH_SUCCESS,
      {
        roles: { [role: string]: boolean };
        colonyAddress: Address;
        domainId: number;
        userAddress: Address;
      },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_NAME_CHECK_AVAILABILITY,
      { colonyName: string },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
      void,
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_NAME_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_NAME_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_NAME_FETCH_SUCCESS,
      { colonyAddress: Address; colonyName: ENSName },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK,
      { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS,
      object,
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_ADDRESS_FETCH,
      { colonyName: ENSName },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_ADDRESS_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_ADDRESS_FETCH_SUCCESS,
      { colonyAddress: Address; colonyName: ENSName },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_FETCH_SUCCESS,
      ColonyType,
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TRANSACTIONS_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_TRANSACTIONS_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TRANSACTIONS_FETCH_SUCCESS,
      { colonyAddress: Address; transactions: ContractTransactionType[] },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<
      ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_ERROR,
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS,
      { colonyAddress: Address; transactions: ContractTransactionType[] },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_MINT_TOKENS,
      { colonyAddress: Address; amount: BigNumber },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_MINT_TOKENS_ERROR, WithKey>
  | UniqueActionType<
      ActionTypes.COLONY_MINT_TOKENS_SUCCESS,
      { amount: BigNumber },
      WithKey
    >
  | UniqueActionType<ActionTypes.COLONY_MINT_TOKENS_SUBMITTED, object, object>
  | UniqueActionType<
      ActionTypes.COLONY_PROFILE_UPDATE,
      {
        colonyAddress: string;
        colonyName: string;
        description: string;
        displayName: string;
        guideline: string;
        website: string;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_PROFILE_UPDATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_PROFILE_UPDATE_SUCCESS,
      {
        colonyAddress: string;
        colonyName: string;
        description: string;
        displayName: string;
        guideline: string;
        website: string;
      },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_RECOVERY_MODE_ENTER,
      { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      object,
      object
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_ROLES_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_ROLES_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_ROLES_FETCH_SUCCESS,
      { admins: Address[]; founder: Address },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
      {
        colonyAddress: Address;
        domainId: number;
        roles: { [role: string]: boolean };
        userAddress: Address;
      },
      WithKey
    >
  | ErrorActionType<
      typeof ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_ERROR,
      WithKey
    >
  | UniqueActionType<
      typeof ActionTypes.COLONY_DOMAIN_USER_ROLES_SET_SUCCESS,
      {
        colonyAddress: Address;
        domainId: number;
        roles: { [role: string]: boolean };
        userAddress: Address;
      },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_SUB_START,
      { colonyAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_SUB_STOP,
      { colonyAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_SUB_EVENTS,
      { colony: ColonyType; colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_SUB_ERROR, WithKey>
  | UniqueActionType<
      ActionTypes.COLONY_VERSION_UPGRADE,
      { colonyAddress: Address },
      object
    >
  | UniqueActionType<ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.COLONY_VERSION_UPGRADE_ERROR, object>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TASK_METADATA_FETCH,
      { colonyAddress: Address },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_TASK_METADATA_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TASK_METADATA_FETCH_SUCCESS,
      {
        colonyAddress: Address;
        colonyTasks: {
          [draftId: string]: {
            commentsStoreAddress: string;
            taskStoreAddress: string;
          };
        };
      },
      WithKey
    >
  | ActionTypeWithPayload<
      ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
      { colonyAddress: Address; tokenAddress: Address }
    >
  | ErrorActionType<ActionTypes.COLONY_TOKEN_BALANCE_FETCH_ERROR, object>
  | ActionTypeWithPayload<
      ActionTypes.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
      {
        token: TokenReferenceType;
        tokenAddress: Address;
        colonyAddress: Address;
      }
    >
  | UniqueActionType<
      ActionTypes.COLONY_UPDATE_TOKENS,
      { colonyAddress: Address; tokens: Address[] },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_UPDATE_TOKENS_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_UPDATE_TOKENS_SUCCESS,
      { colonyAddress: Address; tokens: Address[] },
      object
    >
  | UniqueActionType<
      ActionTypes.COLONY_RECOVER_DB,
      { colonyAddress: Address },
      null
    >
  | ErrorActionType<ActionTypes.COLONY_RECOVER_DB_ERROR, null>
  | UniqueActionType<ActionTypes.COLONY_RECOVER_DB_SUCCESS, null, null>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TASK_METADATA_SUB_START,
      { colonyAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TASK_METADATA_SUB_STOP,
      { colonyAddress: Address },
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_TASK_METADATA_SUB_EVENTS,
      {
        colonyAddress: Address;
        colonyTasks: {
          [draftId: string]: {
            commentsStoreAddress: string;
            taskStoreAddress: string;
          };
        };
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_TASK_METADATA_SUB_ERROR, null>;
