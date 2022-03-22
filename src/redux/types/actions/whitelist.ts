import { ActionTypes } from '~redux/index';
import { Address, WithKey } from '~types/index';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
} from './index';

export type WhitelistActionTypes =
  | UniqueActionType<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE,
      {
        colonyAddress: Address;
        colonyName: string;
        colonyDisplayName: string;
        colonyAvatarImage?: string;
        colonyAvatarHash?: string;
        hasAvatarChanged?: boolean;
        whiteListAddresses: Address[];
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.VERIFIED_RECIPIENTS_MANAGE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<ActionTypes.WHITELIST_ENABLE, any, WithKey>
  | UniqueActionType<ActionTypes.WHITELIST_ENABLE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.WHITELIST_ENABLE_ERROR, object>
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
