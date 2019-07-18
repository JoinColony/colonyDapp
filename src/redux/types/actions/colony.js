/* @flow */

import type BigNumber from 'bn.js';

import type { Address, ENSName, WithKey } from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
  TokenReferenceType,
} from '~immutable';
import type {
  ActionTypeWithPayload,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type ColonyActionTypes = {|
  COLONY_ADMIN_ADD: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD,
    {| newAdmin: Address, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_ADMIN_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_ERROR,
    {| ...WithKey, userAddress: Address |},
  >,
  COLONY_ADMIN_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
    {| user: Address |},
    WithKey,
  >,
  COLONY_ADMIN_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE,
    {| user: Address, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_ADMIN_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
    WithKey,
  >,
  COLONY_ADMIN_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    {| user: Address, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_AVATAR_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE,
    {| user: Address, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_AVATAR_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
    WithKey,
  >,
  COLONY_AVATAR_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
    void,
    WithKey,
  >,
  COLONY_AVATAR_UPLOAD: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD,
    {| colonyAddress: Address, data: string |},
    WithKey,
  >,
  COLONY_AVATAR_UPLOAD_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD_ERROR,
    WithKey,
  >,
  COLONY_AVATAR_UPLOAD_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
    {| hash: string |},
    WithKey,
  >,
  COLONY_CAN_MINT_NATIVE_TOKEN_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR,
    WithKey,
  >,
  COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS,
    {| canMintNativeToken: boolean, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_CLAIM_TOKEN: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN,
    {| tokenAddress: Address, colonyAddress: Address |},
    void,
  >,
  COLONY_CLAIM_TOKEN_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_ERROR,
    void,
  >,
  COLONY_CLAIM_TOKEN_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
    { params: { token: Address } },
    void,
  >,
  COLONY_CREATE: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE,
    {|
      colonyName: string,
      displayName: string,
      tokenAddress?: Address,
      tokenChoice: 'create' | 'select',
      tokenIcon: string,
      tokenName: string,
      tokenSymbol: string,
      username: string,
    |},
    void,
  >,
  COLONY_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CREATE_ERROR,
    void,
  >,
  COLONY_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_SUCCESS,
    void,
    void,
  >,
  COLONY_DOMAINS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_DOMAINS_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_DOMAINS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_ERROR,
    WithKey,
  >,
  COLONY_DOMAINS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
    {| colonyAddress: Address, domains: DomainType[] |},
    WithKey,
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
    WithKey,
  >,
  COLONY_NAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_NAME_FETCH_ERROR,
    WithKey,
  >,
  COLONY_NAME_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_NAME_FETCH_SUCCESS,
    {| colonyAddress: Address, colonyName: ENSName |},
    WithKey,
  >,
  COLONY_NATIVE_TOKEN_UNLOCK: UniqueActionType<
    typeof ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK,
    {| colonyAddress: Address |},
    void,
  >,
  COLONY_NATIVE_TOKEN_UNLOCK_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK_ERROR,
    void,
  >,
  COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS,
    void,
    void,
  >,
  COLONY_ADDRESS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADDRESS_FETCH,
    {| colonyName: ENSName |},
    WithKey,
  >,
  COLONY_ADDRESS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADDRESS_FETCH_ERROR,
    WithKey,
  >,
  COLONY_ADDRESS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ADDRESS_FETCH_SUCCESS,
    {| colonyAddress: Address, colonyName: ENSName |},
    WithKey,
  >,
  COLONY_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_ERROR,
    WithKey,
  >,
  COLONY_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_FETCH_SUCCESS,
    ColonyType,
    WithKey,
  >,
  COLONY_TRANSACTIONS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TRANSACTIONS_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_TRANSACTIONS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TRANSACTIONS_FETCH_ERROR,
    WithKey,
  >,
  COLONY_TRANSACTIONS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_TRANSACTIONS_FETCH_SUCCESS,
    {| colonyAddress: Address, transactions: ContractTransactionType[] |},
    WithKey,
  >,
  COLONY_UNCLAIMED_TRANSACTIONS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_UNCLAIMED_TRANSACTIONS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_ERROR,
    WithKey,
  >,
  COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS,
    {| colonyAddress: Address, transactions: ContractTransactionType[] |},
    WithKey,
  >,
  COLONY_MINT_TOKENS: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS,
    {| colonyAddress: Address, amount: BigNumber |},
    WithKey,
  >,
  COLONY_MINT_TOKENS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_ERROR,
    WithKey,
  >,
  COLONY_MINT_TOKENS_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_SUCCESS,
    {| amount: BigNumber |},
    WithKey,
  >,
  COLONY_MINT_TOKENS_SUBMITTED: UniqueActionType<
    typeof ACTIONS.COLONY_MINT_TOKENS_SUBMITTED,
    void,
    void,
  >,
  COLONY_PROFILE_UPDATE: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE,
    $Shape<ColonyType>,
    WithKey,
  >,
  COLONY_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_ERROR,
    void,
  >,
  COLONY_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
    // ColonyType,
    $Shape<ColonyType>,
    WithKey,
  >,
  COLONY_PROFILE_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_ERROR,
    void,
  >,
  COLONY_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
    ColonyType,
    WithKey,
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
    WithKey,
  >,
  COLONY_ROLES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ROLES_FETCH_ERROR,
    WithKey,
  >,
  COLONY_ROLES_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_ROLES_FETCH_SUCCESS,
    { admins: Address[], founder: Address },
    WithKey,
  >,
  COLONY_SUB_START: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_SUB_START,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_SUB_STOP: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_SUB_STOP,
    {| colonyAddress: Address |},
    WithKey,
  >,
  COLONY_SUB_EVENTS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.COLONY_SUB_EVENTS,
    {| colony: ColonyType, colonyAddress: Address |},
    WithKey,
  >,
  COLONY_SUB_ERROR: ErrorActionType<typeof ACTIONS.COLONY_SUB_ERROR, WithKey>,
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
    WithKey,
  >,
  COLONY_TASK_METADATA_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR,
    WithKey,
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
    WithKey,
  >,
  COLONY_TOKEN_BALANCE_FETCH: ActionTypeWithPayload<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
    {| colonyAddress: Address, tokenAddress: Address |},
  >,
  COLONY_TOKEN_BALANCE_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_ERROR,
    void,
  >,
  COLONY_TOKEN_BALANCE_FETCH_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
    {|
      token: TokenReferenceType,
      tokenAddress: Address,
      colonyAddress: Address,
    |},
  >,
  COLONY_UPDATE_TOKENS: UniqueActionType<
    typeof ACTIONS.COLONY_UPDATE_TOKENS,
    {| colonyAddress: Address, tokens: Address[] |},
    void,
  >,
  COLONY_UPDATE_TOKENS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_UPDATE_TOKENS_ERROR,
    void,
  >,
  COLONY_UPDATE_TOKENS_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_UPDATE_TOKENS_SUCCESS,
    {| colonyAddress: Address, tokens: Address[] |},
    void,
  >,
|};
