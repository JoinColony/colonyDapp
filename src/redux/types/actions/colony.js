/* @flow */

import type { WithKeyPathDepth1, WithKeyPathDepth2 } from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
  TokenReferenceType,
  TokenType,
  TransactionType,
} from '~immutable';
import type {
  ActionType,
  ActionTypeWithMeta,
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type ColonyActionTypes = {|
  COLONY_ADMIN_ADD: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD,
    {| newAdmin: string, colonyENSName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_ERROR,
    {| ...WithKeyPathDepth1, userAddress: string |},
  >,
  COLONY_ADMIN_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
    {| user: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE,
    {| user: string, colonyENSName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    {| user: string, colonyENSName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_AVATAR_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_AVATAR_FETCH_SUCCESS,
    {| hash: string, avatarData: string |},
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_UPLOAD: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD,
    {| data: string |},
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_UPLOAD_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
    {| hash: string |},
    WithKeyPathDepth1,
  >,
  COLONY_CLAIM_TOKEN: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN,
    {| tokenAddress: string, ensName: string |},
    void,
  >,
  COLONY_CLAIM_TOKEN_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_ERROR,
    void,
  >,
  COLONY_CLAIM_TOKEN_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
    {| params: { token: string }, transaction: TransactionType<*, *> |},
    void,
  >,
  COLONY_CREATE: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE,
    {|
      tokenAddress: string,
    |},
    void,
  >,
  COLONY_CREATE_ERROR: ErrorActionType<typeof ACTIONS.COLONY_CREATE_ERROR, *>,
  COLONY_CREATE_LABEL: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL,
    {|
      colonyId: number,
      colonyAddress: string,
      colonyName: string,
      ensName: string,
      tokenAddress: string,
      tokenName: string,
      tokenSymbol: string,
      tokenIcon: string,
    |},
    void,
  >,
  COLONY_CREATE_LABEL_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL_ERROR,
    void,
  >,
  COLONY_CREATE_LABEL_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL_SUCCESS,
    TransactionType<{ colonyName: string }, *>,
    void,
  >,
  COLONY_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_SUCCESS,
    void,
    void,
  >,
  COLONY_ADMINS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADMINS_FETCH,
    {| ensName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMINS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMINS_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMINS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADMINS_FETCH_SUCCESS,
    string[],
    WithKeyPathDepth1,
  >,
  COLONY_DOMAINS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_DOMAINS_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_DOMAINS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_DOMAINS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
    DomainType[],
    WithKeyPathDepth1,
  >,
  COLONY_DOMAIN_VALIDATE: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE,
    {| ensName: string |},
    void,
  >,
  COLONY_DOMAIN_VALIDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE_ERROR,
    void,
  >,
  COLONY_DOMAIN_VALIDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE_SUCCESS,
    void,
    void,
  >,
  COLONY_ENS_NAME_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_ENS_NAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ENS_NAME_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH_SUCCESS,
    string,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH,
    {| ensName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_SUCCESS,
    { colony: ColonyType, tokens: TokenType[] },
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER: ActionType<
    typeof ACTIONS.COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER,
  >,
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_ERROR,
    void,
  >,
  COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.COLONY_FETCH_SUBSCRIBED_FOR_CURRENT_USER_SUCCESS,
    string[],
  >,
  COLONY_FETCH_TRANSACTIONS: ActionTypeWithMeta<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_TRANSACTIONS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_TRANSACTIONS_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS,
    ContractTransactionType[],
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS: ActionTypeWithMeta<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
    ContractTransactionType[],
    WithKeyPathDepth1,
  >,
  COLONY_PROFILE_UPDATE: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE,
    ColonyType,
    WithKeyPathDepth1,
  >,
  COLONY_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_ERROR,
    void,
  >,
  COLONY_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
    ColonyType,
    WithKeyPathDepth1,
  >,
  COLONY_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_ERROR,
    void,
  >,
  COLONY_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
    ColonyType,
    WithKeyPathDepth1,
  >,
  COLONY_RECOVERY_MODE_ENTER: UniqueActionType<
    typeof ACTIONS.COLONY_RECOVERY_MODE_ENTER,
    {| ensName: string |},
    void,
  >,
  COLONY_RECOVERY_MODE_ENTER_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_RECOVERY_MODE_ENTER_ERROR,
    void,
  >,
  COLONY_RECOVERY_MODE_ENTER_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
    void,
    void,
  >,
  COLONY_SUBSCRIBE: ActionTypeWithPayload<
    typeof ACTIONS.COLONY_SUBSCRIBE,
    {| address: string |},
  >,
  COLONY_SUBSCRIBE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_SUBSCRIBE_ERROR,
    void,
  >,
  COLONY_SUBSCRIBE_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.COLONY_SUBSCRIBE,
    {| address: string |},
  >,
  COLONY_VERSION_UPGRADE: UniqueActionType<
    typeof ACTIONS.COLONY_VERSION_UPGRADE,
    {| ensName: string |},
    void,
  >,
  COLONY_VERSION_UPGRADE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_VERSION_UPGRADE_SUCCESS,
    void,
    void,
  >,
  COLONY_VERSION_UPGRADE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_VERSION_UPGRADE_ERROR,
    void,
  >,
  COLONY_TOKEN_BALANCE_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
    {| colonyAddress: string |},
    WithKeyPathDepth2,
  >,
  COLONY_TOKEN_BALANCE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_ERROR,
    WithKeyPathDepth2,
  >,
  COLONY_TOKEN_BALANCE_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
    TokenReferenceType,
    WithKeyPathDepth2,
  >,
|};
