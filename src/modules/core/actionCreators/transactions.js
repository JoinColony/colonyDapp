/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import {
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
  TRANSACTION_STARTED,
} from '../actionTypes';

export function startTransaction(
  id: string,
  actionType: string,
  params: Object,
  options: SendOptions,
) {
  return {
    type: TRANSACTION_STARTED,
    payload: {
      actionType,
      createdAt: new Date(),
      id,
      options,
      params,
    },
  };
}

export function transactionSendError(id: string, message: string) {
  return {
    type: TRANSACTION_ERROR,
    payload: { id, error: { type: 'send', message } },
  };
}

export function transactionEventDataError(id: string, message: string) {
  return {
    type: TRANSACTION_ERROR,
    payload: { id, error: { type: 'eventData', message } },
  };
}

export function transactionReceiptError(id: string, message: string) {
  return {
    type: TRANSACTION_ERROR,
    payload: { id, error: { type: 'receipt', message } },
  };
}

export function transactionReceiptReceived(id: string, receipt: Object) {
  return {
    type: TRANSACTION_RECEIPT_RECEIVED,
    payload: { id, receipt },
  };
}

export function sendTransaction(id: string, hash: string) {
  return {
    type: TRANSACTION_SENT,
    payload: { id, hash },
  };
}

export function transactionEventDataReceived<EventData>(
  id: string,
  eventData: EventData,
) {
  return {
    type: TRANSACTION_EVENT_DATA_RECEIVED,
    payload: { id, eventData },
  };
}
