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
  transactionActionType: string,
  params: Object,
  options: SendOptions,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_STARTED,
    payload: {
      actionType: transactionActionType,
      createdAt: new Date(),
      id,
      options,
      params,
    },
  };
}

export function transactionSendError(
  id: string,
  message: string,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_ERROR,
    payload: { id, error: { type: 'send', message } },
  };
}

export function transactionEventDataError(
  id: string,
  message: string,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_ERROR,
    payload: { id, error: { type: 'eventData', message } },
  };
}

export function transactionReceiptError(
  id: string,
  message: string,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_ERROR,
    payload: { id, error: { type: 'receipt', message } },
  };
}

export function transactionReceiptReceived(
  id: string,
  receipt: Object,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_RECEIPT_RECEIVED,
    payload: { id, receipt },
  };
}

export function sendTransaction(id: string, hash: string, actionType?: string) {
  return {
    type: actionType || TRANSACTION_SENT,
    payload: { id, hash },
  };
}

export function transactionEventDataReceived<EventData>(
  id: string,
  eventData: EventData,
  actionType?: string,
) {
  return {
    type: actionType || TRANSACTION_EVENT_DATA_RECEIVED,
    payload: { id, eventData },
  };
}
