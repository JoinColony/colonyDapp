/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import {
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
  TRANSACTION_STARTED,
} from '../actionTypes';

export const transactionStarted = (
  id: string,
  transactionActionType: string,
  params: Object,
  actionType: ?string,
  options?: SendOptions,
) => ({
  type: actionType || TRANSACTION_STARTED,
  payload: {
    actionType: transactionActionType,
    createdAt: new Date(),
    id,
    options,
    params,
  },
});

export const transactionSendError = (
  id: string,
  message: string,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'send', message } },
});

export const transactionEventDataError = (
  id: string,
  message: string,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'eventData', message } },
});

export const transactionReceiptError = (
  id: string,
  message: string,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'receipt', message } },
});

export const transactionReceiptReceived = (
  id: string,
  receipt: Object,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_RECEIPT_RECEIVED,
  payload: { id, receipt },
});

export const transactionSent = (
  id: string,
  hash: string,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_SENT,
  payload: { id, hash },
});

export const transactionEventDataReceived = <EventData>(
  id: string,
  eventData: EventData,
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_EVENT_DATA_RECEIVED,
  payload: { id, eventData },
});
