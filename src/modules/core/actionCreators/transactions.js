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
  payload: { message: string, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'send', ...payload } },
});

export const transactionEventDataError = (
  id: string,
  payload: { message: string, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'eventData', ...payload } },
});

export const transactionReceiptError = (
  id: string,
  payload: { message: string, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'receipt', ...payload } },
});

export const transactionReceiptReceived = (
  id: string,
  payload: { receipt: Object, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_RECEIPT_RECEIVED,
  payload: { id, ...payload },
});

export const transactionSent = (
  id: string,
  payload: { hash: string, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_SENT,
  payload: { id, ...payload },
});

export const transactionEventDataReceived = <EventData>(
  id: string,
  payload: { eventData: EventData, params: Object },
  actionType?: string,
) => ({
  type: actionType || TRANSACTION_EVENT_DATA_RECEIVED,
  payload: { id, ...payload },
});
