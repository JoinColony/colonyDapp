/* @flow */

import type { SendOptions } from '@colony/colony-js-client';

import BigNumber from 'bn.js';
import nanoid from 'nanoid';

import type {
  AddressOrENSName,
  ColonyContext,
  TransactionReceipt,
} from '~types';
import type {
  TransactionMultisig,
  TransactionParams,
  TransactionEventData,
} from '~immutable';

import type {
  CreateTransactionAction,
  GasPrices,
  LifecycleActionTypes,
  MultisigOperationJSON,
} from '../types';

import {
  MULTISIG_TRANSACTION_CREATED,
  MULTISIG_TRANSACTION_REFRESHED,
  MULTISIG_TRANSACTION_REJECT,
  MULTISIG_TRANSACTION_SIGN,
  MULTISIG_TRANSACTION_SIGNED,
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_ESTIMATE_GAS,
  TRANSACTION_GAS_UPDATE,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
  GAS_PRICES_UPDATE,
} from '../actionTypes';

type TxFactoryOptions = {
  context: ColonyContext,
  lifecycle?: LifecycleActionTypes,
  methodName: string,
  multisig?: boolean,
};

type TxActionCreatorOptions<P: TransactionParams> = {
  identifier?: AddressOrENSName,
  meta: any,
  multisig?: MultisigOperationJSON,
  params: P,
  options?: SendOptions,
};

type TxActionCreator<P: TransactionParams> = (
  TxActionCreatorOptions<P>,
) => CreateTransactionAction<P>;

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxActionCreator = <P: TransactionParams>({
  context,
  lifecycle = {},
  methodName,
  multisig: isMultisig = false,
}: TxFactoryOptions): TxActionCreator<P> => ({
  identifier,
  meta,
  multisig: multisigJSON,
  options,
  params,
  status,
}: TxActionCreatorOptions<P>): CreateTransactionAction<P> => ({
  type: isMultisig ? MULTISIG_TRANSACTION_CREATED : TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    identifier,
    lifecycle,
    methodName,
    multisig: isMultisig ? multisigJSON || {} : undefined,
    options,
    params,
    status,
  },
  meta: { id: meta.id || nanoid() },
});

export const multisigTransactionRefreshError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'multisigRefresh', ...payload } },
  meta: { id },
});

export const multisigTransactionNonceError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'multisigNonce', ...payload } },
  meta: { id },
});

export const multisigTransactionSignError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'multisigSign', ...payload } },
  meta: { id },
});

export const multisigTransactionRejectError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || TRANSACTION_ERROR,
  payload: { error: { type: 'multisigReject', ...payload } },
  meta: { id },
});

export const multisigTransactionRefreshed = (
  id: string,
  multisig: TransactionMultisig,
) => ({
  type: MULTISIG_TRANSACTION_REFRESHED,
  payload: { multisig },
  meta: {
    id,
  },
});

export const multisigTransactionSign = (id: string) => ({
  type: MULTISIG_TRANSACTION_SIGN,
  meta: {
    id,
  },
});

export const multisigTransactionSigned = (id: string) => ({
  type: MULTISIG_TRANSACTION_SIGNED,
  meta: {
    id,
  },
});

export const multisigTransactionReject = (id: string) => ({
  type: MULTISIG_TRANSACTION_REJECT,
  meta: {
    id,
  },
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
  payload: { receipt: TransactionReceipt, params: P },
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

export const transactionEstimateGas = (id: string) => ({
  type: TRANSACTION_ESTIMATE_GAS,
  meta: { id },
});

export const transactionUpdateGas = (
  id: string,
  data: { gasLimit: BigNumber, gasPrice: BigNumber },
) => ({
  type: TRANSACTION_GAS_UPDATE,
  payload: data,
  meta: { id },
});

export const updateGasPrices = (gasPrices: GasPrices) => ({
  type: GAS_PRICES_UPDATE,
  payload: gasPrices,
});
