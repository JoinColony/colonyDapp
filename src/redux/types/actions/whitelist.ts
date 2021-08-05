import { ActionTypes } from '~redux/index';
import { Address } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

export type WhitelistActionTypes =
  | UniqueActionType<
      ActionTypes.WHITELIST_SIGN_AGREEMENT,
      {
        agreementHash: string;
        colonyAddress: Address;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.WHITELIST_SIGN_AGREEMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.WHITELIST_SIGN_AGREEMENT_SUCCESS,
      MetaWithHistory<object>
    >;
