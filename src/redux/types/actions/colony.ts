import { ColonySafe } from '~data/generated';
import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';
import {
  ActionType,
  ErrorActionType,
  UniqueActionType,
  UniqueActionTypeWithoutPayload,
  MetaWithHistory,
} from './index';

export type ColonyActionTypes =
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN,
      { tokenAddress: Address; colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.CLAIM_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN_SUCCESS,
      { params: { token: Address } },
      object
    >
  | UniqueActionType<
      ActionTypes.CREATE,
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
  | ActionType<typeof ActionTypes.CREATE_CANCEL>
  | ErrorActionType<ActionTypes.CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.CREATE_SUCCESS, void, object>
  | UniqueActionType<
      ActionTypes.DEPLOYMENT_RESTART,
      {
        colonyAddress: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.DEPLOYMENT_RESTART_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.DEPLOYMENT_RESTART_SUCCESS,
      object
    >
  | ErrorActionType<ActionTypes.RECOVERY_MODE_ENTER_ERROR, object>
  | UniqueActionType<ActionTypes.RECOVERY_MODE_ENTER_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_INSTALL,
      { colonyAddress: Address; extensionId: string },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_INSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_INSTALL_ERROR, object>
  | UniqueActionType<ActionTypes.EXTENSION_ENABLE, any, WithKey>
  | UniqueActionType<ActionTypes.EXTENSION_ENABLE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_ENABLE_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_DEPRECATE,
      { colonyAddress: Address; extensionId: string; isToDeprecate: boolean },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_DEPRECATE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_DEPRECATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UNINSTALL,
      { colonyAddress: Address; extensionId: string },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UPGRADE,
      { colonyAddress: Address; extensionId: string; version: number },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UPGRADE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UPGRADE_ERROR, object>
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE,
      {
        colonyAddress: Address;
        colonyDisplayName: string;
        colonyAvatarHash: string;
        verifiedAddresses: Address[];
        colonyTokens: Address[];
        annotationMessage?: string;
        colonyName: string;
        isWhitelistActivated: boolean;
        colonySafes: ColonySafe[];
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.VERIFIED_RECIPIENTS_MANAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      object,
      object
    >;
