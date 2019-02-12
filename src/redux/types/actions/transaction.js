/* @flow */

import type { ActionType } from '~types';
import type { TransactionType } from '~immutable';

import { ACTIONS } from '../../index';

export type TransactionActionTypes = {|
  METHOD_TRANSACTION_SENT: ActionType<
    typeof ACTIONS.METHOD_TRANSACTION_SENT,
    {||},
    void,
  >,
  TRANSACTION_ADD_PROPERTIES: ActionType<
    typeof ACTIONS.TRANSACTION_ADD_PROPERTIES,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_CANCEL: ActionType<
    typeof ACTIONS.TRANSACTION_CANCEL,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_CREATED: ActionType<
    typeof ACTIONS.TRANSACTION_CREATED,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_ERROR: ActionType<
    typeof ACTIONS.TRANSACTION_ERROR,
    {| error: Object |},
    {| error: boolean |},
  >,
  TRANSACTION_ESTIMATE_GAS: ActionType<
    typeof ACTIONS.TRANSACTION_ESTIMATE_GAS,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_EVENT_DATA_RECEIVED: ActionType<
    typeof ACTIONS.TRANSACTION_EVENT_DATA_RECEIVED,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_GAS_UPDATE: ActionType<
    typeof ACTIONS.TRANSACTION_GAS_UPDATE,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_RECEIPT_RECEIVED: ActionType<
    typeof ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
    TransactionType<*, *>,
    void,
  >,
  TRANSACTION_SENT: ActionType<
    typeof ACTIONS.TRANSACTION_SENT,
    TransactionType<*, *>,
    void,
  >,
|};
