/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import nanoid from 'nanoid';

import type { CreateTransactionAction, LifecycleActionTypes } from '../types';
import type { TransactionParams, TransactionEventData } from '~types/index';
import type {
  ColonyContext,
  ColonyIdentifier,
} from '../../../lib/ColonyManager/types';

import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SET,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

export const createTransaction = <P: TransactionParams>({
  context,
  identifier,
  lifecycle = {},
  methodName,
  options,
  params,
  ...payload
}: {
  context: ColonyContext,
  identifier?: ColonyIdentifier,
  lifecycle?: LifecycleActionTypes,
  methodName: string,
  options?: SendOptions,
  params: P,
}): CreateTransactionAction<P> => ({
  type: TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    id: nanoid(),
    identifier,
    lifecycle,
    methodName,
    options,
    params,
    ...payload,
  },
});

export const createNetworkTransaction = <P: TransactionParams>({
  methodName,
  params,
  ...payload
}: {
  methodName: string,
  params: P,
}): CreateTransactionAction<P> =>
  createTransaction<P>({
    context: NETWORK_CONTEXT,
    methodName,
    params,
    ...payload,
  });

export const createColonyTransaction = <P: TransactionParams>({
  methodName,
  params,
  ...payload
}: {
  methodName: string,
  params: P,
}): CreateTransactionAction<P> =>
  createTransaction({
    context: COLONY_CONTEXT,
    methodName,
    params,
    ...payload,
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
