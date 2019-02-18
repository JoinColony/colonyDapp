/* @flow */

import type { UniqueActionType, ActionType } from '~redux';
import type { TransactionError, TransactionType } from '~immutable';

import { ACTIONS } from '../../index';

export type TransactionActionTypes = {|
  TRANSACTION_ADD_PROPERTIES: UniqueActionType<
    typeof ACTIONS.TRANSACTION_ADD_PROPERTIES,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_CANCEL: UniqueActionType<
    typeof ACTIONS.TRANSACTION_CANCEL,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_CREATED: UniqueActionType<
    typeof ACTIONS.TRANSACTION_CREATED,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_ERROR: {|
    ...ActionType<
      typeof ACTIONS.TRANSACTION_ERROR,
      TransactionError,
      { id: string },
    >,
    error: true,
  |},
  TRANSACTION_ESTIMATE_GAS: UniqueActionType<
    typeof ACTIONS.TRANSACTION_ESTIMATE_GAS,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_GAS_UPDATE: UniqueActionType<
    typeof ACTIONS.TRANSACTION_GAS_UPDATE,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_RECEIPT_RECEIVED: UniqueActionType<
    typeof ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_SEND: UniqueActionType<typeof ACTIONS.TRANSACTION_SEND, *, *>,
  TRANSACTION_SENT: UniqueActionType<
    typeof ACTIONS.TRANSACTION_SENT,
    $Shape<TransactionType<*, *>>,
    *,
  >,
  TRANSACTION_SUCCEEDED: UniqueActionType<
    typeof ACTIONS.TRANSACTION_SUCCEEDED,
    $Shape<TransactionType<*, *>>,
    *,
  >,
|};
