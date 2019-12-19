import BigNumber from 'bn.js';

import { ROLES } from '~constants';
import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';
import {
  ContractTransactionType,
  DomainType,
  ColonyRolesType,
} from '~immutable/index';
import {
  ActionType,
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
      {
        colonyAddress: Address;
        options?: {
          fetchRoles?: boolean;
        };
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.COLONY_DOMAINS_FETCH_ERROR, WithKey>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.COLONY_DOMAINS_FETCH_SUCCESS,
      { colonyAddress: Address; domains: DomainType[] },
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
      ColonyRolesType,
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
      {
        colonyAddress: Address;
        domainId: number;
        roles: Record<ROLES, boolean>;
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
        roles: Record<ROLES, boolean>;
        userAddress: Address;
      },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_VERSION_UPGRADE,
      { colonyAddress: Address },
      object
    >
  | UniqueActionType<ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.COLONY_VERSION_UPGRADE_ERROR, object>
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH,
      { colonyAddress: Address; userAddress: Address },
      WithKey
    >
  | ErrorActionType<
      ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH_ERROR,
      WithKey
    >
  | ActionTypeWithPayloadAndMeta<
      ActionTypes.TEMP_COLONY_USER_HAS_RECOVERY_ROLE_FETCH_SUCCESS,
      {
        colonyAddress: Address;
        userAddress: Address;
        userHasRecoveryRole: boolean;
      },
      WithKey
    >;
