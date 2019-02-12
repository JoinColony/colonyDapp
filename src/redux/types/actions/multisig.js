/* @flow */

import type { UniqueActionType } from '~redux';
import type { TransactionType } from '~immutable';

import { ACTIONS } from '../../index';

export type MultisigActionTypes = {|
  MULTISIG_TRANSACTION_CREATED: UniqueActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_CREATED,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  MULTISIG_TRANSACTION_REFRESHED: UniqueActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  MULTISIG_TRANSACTION_REJECT: UniqueActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_REJECT,
    *,
    *,
  >,
  MULTISIG_TRANSACTION_SIGN: UniqueActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGN,
    *,
    *,
  >,
  MULTISIG_TRANSACTION_SIGNED: UniqueActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED,
    *,
    *,
  >,
|};
