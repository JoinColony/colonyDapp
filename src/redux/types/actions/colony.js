/* @flow */

import type BigNumber from 'bn.js';

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
    {| newAdmin: string, colonyAddress: Address |},
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
    {| user: string, colonyAddress: Address |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    {| user: Address, colonyAddress: Address |},
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE,
    {| user: Address, colonyAddress: Address |},
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
    {| colonyAddress: Address, data: string |},
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
    {| tokenAddress: string, colonyAddress: Address |},
    WithKeyPathDepth2,
  >,
  COLONY_CLAIM_TOKEN_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_ERROR,
    WithKeyPathDepth2,
  >,
  COLONY_CLAIM_TOKEN_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
    {| params: { token: string }, transaction: TransactionType<*, *> |},
    WithKeyPathDepth2,
  >,
  COLONY_CREATE_LABEL: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL,
    {|
      colonyAddress: Address,
      colonyId: number,
      colonyName: ENSName,
      displayName: string,
      tokenAddress: Address,
      tokenIcon: string,
      tokenName: string,
      tokenSymbol: string,
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
  COLONY_CREATE: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE,
    {|
      // These don't exist yet
      /* colonyId: number,
      tokenAddress: string,
      tokenIcon: string,
      colonyAddress: string, */
      username: string,
      colonyName: string,
      ensName: string,
      tokenName: string,
      tokenSymbol: string,
    |},
    void,
  >,
  COLONY_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CREATE_ERROR,
    void,
  >,
  COLONY_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_SUCCESS,
    TransactionType<{ colonyName: string }, *>,
    void,
  >,
  COLONY_DOMAINS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_DOMAINS_FETCH,
    {| colonyAddress: Address |},
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
  COLONY_NAME_CHECK_AVAILABILITY: UniqueActionType<
    typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY,
    {| colonyName: string |},
    void,
  >,
  COLONY_NAME_CHECK_AVAILABILITY_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
    void,
  >,
  COLONY_NAME_CHECK_AVAILABILITY_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
    void,
    void,
  >,
  COLONY_NAME_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_NAME_FETCH,
    {| colonyAddress: Address |},
    WithKeyPathDepth1,
  >,
  COLONY_NAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_NAME_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_NAME_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_NAME_FETCH_SUCCESS,
    {| colonyAddress: Address, colonyName: ENSName |},
    WithKeyPathDepth1,
  >,
  COLONY_ADDRESS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADDRESS_FETCH,
    {| colonyName: ENSName |},
    WithKeyPathDepth1,
  >,
  COLONY_ADDRESS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADDRESS_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADDRESS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADDRESS_FETCH_SUCCESS,
    {| colonyAddress: Address, colonyName: ENSName |},
    WithKeyPathDepth1,
  >,
  COLONY_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH,
    {| colonyAddress: Address |},
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
  COLONY_FETCH_TRANSACTIONS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS,
    {| colonyAddress: Address |},
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
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    {| colonyAddress: Address |},
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
  COLONY_MINT_TOKENS: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS,
    {| colonyAddress: Address, amount: BigNumber |},
    WithKeyPathDepth1,
  >,
  COLONY_MINT_TOKENS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_MINT_TOKENS_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_SUCCESS,
    {| amount: BigNumber |},
    WithKeyPathDepth1,
  >,
  COLONY_MINT_TOKENS_SUBMITTED: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_SUBMITTED,
    void,
    void,
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
    {| colonyAddress: Address |},
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
    {| colonyAddress: Address |},
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
    {| colonyAddress: Address |},
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
  COLONY_TASK_METADATA_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TASK_METADATA_FETCH,
    {| colonyAddress: Address |},
    WithKeyPathDepth1,
  >,
  COLONY_TASK_METADATA_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_TASK_METADATA_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS,
    {|
      colonyAddress: Address,
      colonyTasks: {
        [draftId: string]: {|
          commentsStoreAddress: string,
          taskStoreAddress: string,
        |},
      },
    |},
    WithKeyPathDepth1,
  >,
  COLONY_TOKEN_BALANCE_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
    {| colonyAddress: Address |},
    WithKeyPathDepth2,
  >,
  COLONY_TOKEN_BALANCE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_ERROR,
    WithKeyPathDepth2,
  >,
  COLONY_TOKEN_BALANCE_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
    {|
      token: TokenReferenceType,
      tokenAddress: Address,
      colonyAddress: Address,
    |},
    WithKeyPathDepth2,
  >,
  COLONY_UPDATE_TOKENS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_UPDATE_TOKENS,
    {| colonyAddress: Address, tokens: Address[] |},
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
