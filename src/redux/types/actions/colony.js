/* @flow */

import type {
  Address,
  ENSName,
  WithKeyPathDepth1,
  WithKeyPathDepth2,
} from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
  TokenReferenceType,
  TransactionType,
} from '~immutable';
import type {
  ActionTypeWithMeta,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type ColonyActionTypes = {|
  COLONY_ADMIN_ADD: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD,
    {| newAdmin: string, colonyName: string |},
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
    {| user: string, colonyName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    {| user: string, colonyName: string |},
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
    {| tokenAddress: string, colonyName: string |},
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
      colonyAddress: Address,
      colonyName: ENSName,
      displayName: string,
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
    {| colonyName: string |},
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
  COLONY_NAME_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_NAME_FETCH,
    {| colonyAddress: string |},
    WithKeyPathDepth1,
  >,
  COLONY_NAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_NAME_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_NAME_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_NAME_FETCH_SUCCESS,
    string,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH,
    {| colonyName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_SUCCESS,
    ColonyType,
    WithKeyPathDepth1,
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
    {| colonyName: string |},
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
  COLONY_ROLES_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ROLES_FETCH,
    {| colonyName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ROLES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ROLES_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ROLES_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ROLES_FETCH_SUCCESS,
    { admins: string[], founder: string },
    WithKeyPathDepth1,
  >,
  COLONY_VERSION_UPGRADE: UniqueActionType<
    typeof ACTIONS.COLONY_VERSION_UPGRADE,
    {| colonyName: string |},
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
  COLONY_UPDATE_TOKENS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_UPDATE_TOKENS,
    {| tokens: string[] |},
    WithKeyPathDepth1,
  >,
  COLONY_UPDATE_TOKENS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_UPDATE_TOKENS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_UPDATE_TOKENS_SUCCESS: ActionTypeWithMeta<
    typeof ACTIONS.COLONY_UPDATE_TOKENS_SUCCESS,
    WithKeyPathDepth1,
  >,
|};
