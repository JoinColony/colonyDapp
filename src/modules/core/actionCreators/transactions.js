/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import type { LifecycleActionTypes } from '../types';
import type { TransactionParams, TransactionEventData } from '~types/index';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SET,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

export const transactionCreated = <P: TransactionParams>({
  contextName,
  id,
  lifecycleActionTypes,
  methodName,
  options,
  overrideActionType,
  params,
}: {
  contextName: string,
  id: string,
  lifecycleActionTypes: LifecycleActionTypes,
  methodName: string,
  options?: SendOptions,
  overrideActionType?: string,
  params: P,
}) => ({
  type: overrideActionType || TRANSACTION_CREATED,
  payload: {
    contextName,
    createdAt: new Date(),
    id,
    lifecycleActionTypes,
    methodName,
    options,
    params,
  },
});

export const transactionSendError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'send', ...payload } },
});

export const transactionUnsuccessfulError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'unsuccessful', ...payload } },
});

export const transactionEventDataError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'eventData', ...payload } },
});

export const transactionReceiptError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { id, error: { type: 'receipt', ...payload } },
});

export const transactionReceiptReceived = <P: TransactionParams>(
  id: string,
  payload: { receipt: Object, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_RECEIPT_RECEIVED,
  payload: { id, ...payload },
});

export const transactionSent = <P: TransactionParams>(
  id: string,
  payload: { hash: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_SENT,
  payload: { id, ...payload },
});

export const transactionEventDataReceived = <
  P: TransactionParams,
  E: TransactionEventData,
>(
  id: string,
  payload: { eventData: E, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_EVENT_DATA_RECEIVED,
  payload: { id, ...payload },
});

export const transactionGasSuggested = (
  id: string,
  suggestedGasLimit: number,
  suggestedGasPrice: number,
) => ({
  type: TRANSACTION_GAS_SUGGESTED,
  payload: {
    id,
    suggestedGasLimit,
    suggestedGasPrice,
  },
});

export const transactionGasSet = (
  id: string,
  gasLimit: number,
  gasPrice: number,
) => ({
  type: TRANSACTION_GAS_SET,
  payload: {
    id,
    gasLimit,
    gasPrice,
  },
});
