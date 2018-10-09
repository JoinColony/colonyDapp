/* @flow */

import {
  TRANSACTION_EVENT_DATA_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_ERROR,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SEND_ERROR,
  TRANSACTION_SENT,
  TRANSACTION_STARTED,
} from '../actionTypes';

// TODO update colonyJS for this import and remove the temporary type below.
// import type { SendOptions } from '@colony/colony-js-client';
type SendOptions = Object;

export function startTransaction(
  transactionId: string,
  actionType: string,
  params: Object,
  options: SendOptions,
) {
  return {
    type: TRANSACTION_STARTED,
    payload: {
      actionType,
      options,
      params,
      transactionId,
    },
  };
}

export function transactionSendError(transactionId: string, sendError: Error) {
  return {
    type: TRANSACTION_SEND_ERROR,
    payload: { transactionId, sendError },
  };
}

export function transactionEventDataError(hash: string, eventDataError: Error) {
  return {
    type: TRANSACTION_EVENT_DATA_ERROR,
    payload: { hash, eventDataError },
  };
}

export function transactionReceiptError(hash: string, receiptError: Error) {
  return {
    type: TRANSACTION_RECEIPT_ERROR,
    payload: { hash, receiptError },
  };
}

export function transactionReceiptReceived(hash: string) {
  return {
    type: TRANSACTION_RECEIPT_RECEIVED,
    payload: { hash },
  };
}

export function sendTransaction(hash: string, transactionId: string) {
  return {
    type: TRANSACTION_SENT,
    payload: { hash, transactionId },
  };
}

export function transactionEventDataReceived<EventData>(
  hash: string,
  eventData: EventData,
) {
  return {
    type: TRANSACTION_EVENT_DATA_RECEIVED,
    payload: { hash, eventData },
  };
}
