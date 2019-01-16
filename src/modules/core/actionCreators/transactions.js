/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import BigNumber from 'bn.js';
import nanoid from 'nanoid';

import type { CreateTransactionAction, LifecycleActionTypes } from '../types';
import type { AddressOrENSName, ColonyContext } from '~types';
import type { TransactionParams, TransactionEventData } from '~immutable';

import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_GAS_MANUAL,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

type TxFactoryOptions = {
  context: ColonyContext,
  lifecycle?: LifecycleActionTypes,
  methodName: string,
};

type TxActionCreatorOptions<P: TransactionParams> = {
  identifier?: AddressOrENSName,
  meta: any,
  params: P,
  options?: SendOptions,
};

type TxActionCreator<P: TransactionParams> = (
  TxActionCreatorOptions<P>,
) => CreateTransactionAction<P>;

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
const SAFE_GAS_LIMIT_MULTIPLIER = 1.1;

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxActionCreator = <P: TransactionParams>({
  context,
  lifecycle = {},
  methodName,
}: TxFactoryOptions): TxActionCreator<P> => ({
  identifier,
  meta,
  options,
  params,
}: TxActionCreatorOptions<P>): CreateTransactionAction<P> => ({
  type: TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    identifier,
    lifecycle,
    methodName,
    options,
    params,
  },
  meta: { id: meta.id || nanoid() },
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
  identifier,
  methodName,
  params,
  ...payload
}: {
  identifier: AddressOrENSName,
  methodName: string,
  params: P,
}): CreateTransactionAction<P> =>
  createTransaction({
    context: COLONY_CONTEXT,
    identifier,
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
  payload: { error: { type: 'send', ...payload } },
  meta: { id },
});

export const transactionUnsuccessfulError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'unsuccessful', ...payload } },
  meta: { id },
});

export const transactionEventDataError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'eventData', ...payload } },
  meta: { id },
});

export const transactionReceiptError = <P: TransactionParams>(
  id: string,
  payload: { message: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'receipt', ...payload } },
  meta: { id },
});

export const transactionReceiptReceived = <P: TransactionParams>(
  id: string,
  payload: { receipt: Object, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSent = <P: TransactionParams>(
  id: string,
  payload: { hash: string, params: P },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_SENT,
  payload,
  meta: { id },
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
  payload,
  meta: { id },
});

export const transactionGasSuggested = (
  id: string,
  suggestedGasLimit: number,
  suggestedGasPrice: number,
) => ({
  type: TRANSACTION_GAS_SUGGESTED,
  payload: {
    suggestedGasLimit,
    suggestedGasPrice,
  },
  meta: { id },
});

export const transactionGasManualSet = (
  id: string,
  gasPrice: number,
  gasLimit: number,
): TransactionParams => {
  const manualGasAction: Object = {
    type: TRANSACTION_GAS_MANUAL,
    payload: {},
    meta: { id },
  };
  if (gasPrice) {
    manualGasAction.payload.suggestedGasPrice = new BigNumber(gasPrice);
  }
  if (gasLimit) {
    manualGasAction.payload.suggestedGasLimit = new BigNumber(
      parseInt(gasLimit * SAFE_GAS_LIMIT_MULTIPLIER, 10),
    );
  }
  return manualGasAction;
};
