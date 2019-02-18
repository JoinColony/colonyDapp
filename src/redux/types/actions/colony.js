/* @flow */

import type { WithKeyPathDepth1 } from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
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
    {| newAdmin: Object, ensName: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_ADD_CONFIRM_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_CONFIRM_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_ADD_CONFIRM_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
    {| username: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
    {| adminData: Object, username: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE,
    {| admin: Object, username: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_CONFIRM_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
    {| username: string |},
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ADMIN_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
    {| username: string |},
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_FETCH_SUCCESS: UniqueActionType<
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
    void,
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
  COLONY_DOMAINS_FETCH: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_DOMAINS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_DOMAINS_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
    { _id: string & DomainType }[],
    WithKeyPathDepth1,
  >,
  COLONY_ENS_NAME_FETCH: UniqueActionType<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH,
    void,
    WithKeyPathDepth1,
  >,
  COLONY_ENS_NAME_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_ENS_NAME_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_ENS_NAME_FETCH_SUCCESS,
    string,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH: ActionTypeWithMeta<
    typeof ACTIONS.COLONY_FETCH,
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
|};
