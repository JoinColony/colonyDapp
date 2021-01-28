import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';
import { ActionType, ErrorActionType, UniqueActionType } from './index';

export type ColonyActionTypes =
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
        recover: string;
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
  | UniqueActionType<
      ActionTypes.COLONY_DOMAIN_USER_ROLES_SET,
      {
        colonyAddress: Address;
        domainId: number;
        roles: Record<ColonyRole, boolean>;
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
        roles: Record<ColonyRole, boolean>;
        userAddress: Address;
      },
      WithKey
    >;
