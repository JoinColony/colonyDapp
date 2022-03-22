import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';
import {
  ActionType,
  ErrorActionType,
  UniqueActionType,
  UniqueActionTypeWithoutPayload,
} from './index';

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
      ActionTypes.COLONY_DEPLOYMENT_RESTART,
      {
        colonyAddress: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.COLONY_DEPLOYMENT_RESTART_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.COLONY_DEPLOYMENT_RESTART_SUCCESS,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_INSTALL,
      { colonyAddress: Address; extensionId: string },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_INSTALL_ERROR, object>
  | UniqueActionType<ActionTypes.COLONY_EXTENSION_ENABLE, any, WithKey>
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_ENABLE_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_ENABLE_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_DEPRECATE,
      { colonyAddress: Address; extensionId: string; isToDeprecate: boolean },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_DEPRECATE_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_DEPRECATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_UNINSTALL,
      { colonyAddress: Address; extensionId: string },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_UNINSTALL_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_UPGRADE,
      { colonyAddress: Address; extensionId: string; version: number },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_UPGRADE_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_UPGRADE_ERROR, object>
  | UniqueActionType<
      ActionTypes.COLONY_EXTENSION_UNINSTALL_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.WHITELIST_UPDATE,
      { userAddresses: [Address]; colonyAddress: Address; status: boolean },
      WithKey
    >
  | UniqueActionType<ActionTypes.WHITELIST_UPDATE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.WHITELIST_UPDATE_ERROR, object>;
