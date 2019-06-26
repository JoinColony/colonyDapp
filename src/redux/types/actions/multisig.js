/* @flow */

import type { ActionTypeWithMeta, ActionTypeWithPayloadAndMeta } from '~redux';
import type { TransactionMultisig, TransactionType } from '~immutable';
import type { $Pick } from '~types';

import { ACTIONS } from '../../index';

type WithId = {| id: string |};

export type MultisigActionTypes = {|
  MULTISIG_TRANSACTION_CREATED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MULTISIG_TRANSACTION_CREATED,
    $Pick<
      TransactionType,
      {
        context: *,
        createdAt: *,
        from: *,
        group: *,
        identifier: *,
        methodContext: *,
        methodName: *,
        multisig: *,
        options?: *,
        params: *,
        status: *,
      },
    >,
    WithId,
  >,
  MULTISIG_TRANSACTION_REFRESHED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED,
    {| multisig: TransactionMultisig |},
    WithId,
  >,
  MULTISIG_TRANSACTION_REJECT: ActionTypeWithMeta<
    typeof ACTIONS.MULTISIG_TRANSACTION_REJECT,
    WithId,
  >,
  MULTISIG_TRANSACTION_SIGN: ActionTypeWithMeta<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGN,
    WithId,
  >,
  MULTISIG_TRANSACTION_SIGNED: ActionTypeWithMeta<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED,
    WithId,
  >,
|};
