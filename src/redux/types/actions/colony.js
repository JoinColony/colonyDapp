/* @flow */

import type { WithKeyPathDepth1 } from '~types';
import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
  TransactionType,
} from '~immutable';
import type { ActionType, ErrorActionType, UniqueActionType } from '../index';

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
    *,
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
    *,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_AVATAR_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
    *,
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
    *,
    WithKeyPathDepth1,
  >,
  COLONY_CLAIM_TOKEN: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN,
    {| tokenAddress: string, ensName: string |},
    *,
  >,
  COLONY_CLAIM_TOKEN_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_ERROR,
    *,
  >,
  COLONY_CLAIM_TOKEN_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CLAIM_TOKEN_SUCCESS,
    {| params: { token: string }, transaction: TransactionType<*, *> |},
    *,
  >,
  COLONY_CREATE: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE,
    {|
      tokenAddress: string,
    |},
    *,
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
    *,
  >,
  COLONY_CREATE_LABEL_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL_ERROR,
    *,
  >,
  COLONY_CREATE_LABEL_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_LABEL_SUCCESS,
    TransactionType<{ colonyName: string }, *>,
    *,
  >,
  COLONY_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_CREATE_SUCCESS,
    *,
    *,
  >,
  COLONY_DOMAIN_VALIDATE: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE,
    {| ensName: string |},
    *,
  >,
  COLONY_DOMAIN_VALIDATE_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE_ERROR,
    *,
  >,
  COLONY_DOMAIN_VALIDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAIN_VALIDATE_SUCCESS,
    *,
    *,
  >,
  COLONY_DOMAINS_FETCH: UniqueActionType<
    typeof ACTIONS.COLONY_DOMAINS_FETCH,
    *,
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
    *,
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
  COLONY_FETCH: ActionType<typeof ACTIONS.COLONY_FETCH, *, WithKeyPathDepth1>,
  COLONY_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.COLONY_FETCH_SUCCESS,
    ColonyType,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_TRANSACTIONS: ActionType<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS,
    *,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_TRANSACTIONS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_TRANSACTIONS_SUCCESS: ActionType<
    typeof ACTIONS.COLONY_FETCH_TRANSACTIONS_SUCCESS,
    ContractTransactionType[],
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS: ActionType<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
    *,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR: ErrorActionType<
    typeof ACTIONS.COLONY_FETCH_UNCLAIMED_TRANSACTIONS_ERROR,
    WithKeyPathDepth1,
  >,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS: ActionType<
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
    *,
  >,
  COLONY_PROFILE_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
    ColonyType,
    WithKeyPathDepth1,
  >,
|};
