import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
  UniqueActionTypeWithoutPayload,
} from './index';

export type CoinMachineActionTypes =
  | UniqueActionType<
      ActionTypes.COIN_MACHINE_BUY_TOKENS,
      {
        colonyAddress: Address;
        amount: string;
        colonyName: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COIN_MACHINE_BUY_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COIN_MACHINE_BUY_TOKENS_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<ActionTypes.COIN_MACHINE_ENABLE, any, WithKey>
  | UniqueActionType<ActionTypes.COIN_MACHINE_ENABLE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.COIN_MACHINE_ENABLE_ERROR, object>
  | UniqueActionType<
      ActionTypes.COIN_MACHINE_PERIOD_UPDATE,
      {
        colonyAddress: Address;
      },
      object
    >
  | ErrorActionType<ActionTypes.COIN_MACHINE_PERIOD_UPDATE_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.COIN_MACHINE_PERIOD_UPDATE_SUCCESS,
      object
    >;
