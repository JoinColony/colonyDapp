/* @flow */

import type { ActionType } from '~types';
import type { TransactionType } from '~immutable';

import { ACTIONS } from '../../index';

export type MultisigActionTypes = {|
  MULTISIG_TRANSACTION_CREATED: ActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_CREATED,
    TransactionType<*, *>,
    void,
  >,
  MULTISIG_TRANSACTION_REFRESHED: ActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED,
    TransactionType<*, *>,
    void,
  >,
  MULTISIG_TRANSACTION_REJECT: ActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_REJECT,
    {||},
    void,
  >,
  MULTISIG_TRANSACTION_SIGN: ActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGN,
    {||},
    void,
  >,
  MULTISIG_TRANSACTION_SIGNED: ActionType<
    typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED,
    {||},
    void,
  >,
|};
