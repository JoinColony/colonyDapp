import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

export type CoinMachineActionTypes =
  | UniqueActionType<
      ActionTypes.COIN_MACHINE_BUY_TOKENS,
      {
        colonyAddress: Address;
        amount: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.COIN_MACHINE_BUY_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.COIN_MACHINE_BUY_TOKENS_SUCCESS,
      MetaWithHistory<object>
    >;
