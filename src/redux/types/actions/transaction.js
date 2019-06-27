/* @flow */

import type { ActionTypeWithPayloadAndMeta, ActionTypeWithMeta } from '~redux';
import type { TransactionError, TransactionType } from '~immutable';
import type { TransactionReceipt, $Pick } from '~types';

import { ACTIONS } from '../../index';
import BigNumber from 'bn.js';

type WithId = {| id: string |};

export type TransactionActionTypes = {|
  TRANSACTION_ADD_IDENTIFIER: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_ADD_IDENTIFIER,
    {| identifier: string |},
    WithId,
  >,
  TRANSACTION_ADD_PARAMS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_ADD_PARAMS,
    {| params: Object |},
    WithId,
  >,
  TRANSACTION_READY: ActionTypeWithMeta<
    typeof ACTIONS.TRANSACTION_READY,
    WithId,
  >,
  TRANSACTION_CANCEL: ActionTypeWithMeta<
    typeof ACTIONS.TRANSACTION_CANCEL,
    WithId,
  >,
  TRANSACTION_CREATED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_CREATED,
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
  TRANSACTION_ERROR: {|
    ...ActionTypeWithPayloadAndMeta<
      typeof ACTIONS.TRANSACTION_ERROR,
      { error: TransactionError },
      { id: string },
    >,
    error: true,
  |},
  TRANSACTION_ESTIMATE_GAS: ActionTypeWithMeta<
    typeof ACTIONS.TRANSACTION_ESTIMATE_GAS,
    WithId,
  >,
  TRANSACTION_GAS_UPDATE: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_GAS_UPDATE,
    {| gasLimit?: BigNumber, gasPrice?: BigNumber |},
    WithId,
  >,
  TRANSACTION_RECEIPT_RECEIVED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    {| receipt: TransactionReceipt, params: Object |},
    WithId,
  >,
  TRANSACTION_SEND: ActionTypeWithMeta<typeof ACTIONS.TRANSACTION_SEND, WithId>,
  TRANSACTION_SENT: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_SENT,
    {| hash: string, params: Object |},
    WithId,
  >,
  TRANSACTION_SUCCEEDED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.TRANSACTION_SUCCEEDED,
    {| eventData: Object, params: Object |},
    WithId,
  >,
|};
