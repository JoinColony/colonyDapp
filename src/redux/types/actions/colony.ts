import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';
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
      ActionTypes.COLONY_RECOVERY_MODE_ENTER,
      { colonyAddress: Address },
      object
    >
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
    >;
