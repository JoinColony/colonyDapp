import { ErrorActionType, UniqueActionType } from './index';

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
  | ErrorActionType<ActionTypes.TOKEN_CREATE_ERROR, any>;
