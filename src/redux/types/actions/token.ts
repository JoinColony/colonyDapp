import { ErrorActionType, UniqueActionType } from './index';
import { Address, WithKey } from '~types/index';

import { ActionTypes } from '../../index';

export type TokenActionTypes =
  | UniqueActionType<
      ActionTypes.TOKEN_CREATE,
      {
        tokenName: string;
        tokenSymbol: string;
      },
      any
    >
  | ErrorActionType<ActionTypes.TOKEN_CREATE_ERROR, any>
  | UniqueActionType<
      ActionTypes.TOKEN_INFO_FETCH,
      {
        tokenAddress: Address;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.TOKEN_INFO_FETCH_ERROR, WithKey>
  | UniqueActionType<
      ActionTypes.TOKEN_INFO_FETCH_SUCCESS,
      {
        decimals: number;
        isVerified: boolean;
        name: string;
        symbol: string;
        tokenAddress: Address;
      },
      WithKey
    >;
