/* @flow */

import BigNumber from 'bn.js';

import type { TransactionReceipt } from '~types';
import type {
  GasPricesProps,
  TransactionError,
  TransactionEventData,
  TransactionMultisig,
  TransactionParams,
} from '~immutable';

import { ACTIONS } from '~redux';

import type { TxConfig } from '../types';

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxAction = <P>(
  id: string,
  from: string,
  {
    context,
    identifier,
    methodName,
    group,
    multisig: multisigConfig,
    params,
    ready,
    options,
  }: TxConfig<P>,
) => ({
  type: multisigConfig
    ? ACTIONS.MULTISIG_TRANSACTION_CREATED
    : ACTIONS.TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodName,
    multisig: typeof multisigConfig == 'boolean' ? {} : multisigConfig,
    options,
    params,
    status: ready === false ? 'created' : 'ready',
  },
  meta: { id },
});

export const multisigTransactionRefreshError = (
  id: string,
  payload: { message: string },
) => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigRefresh', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionNonceError = (
  id: string,
  payload: { message: string },
) => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigNonce', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionSignError = (
  id: string,
  payload: { message: string },
) => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigSign', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionRejectError = (
  id: string,
  payload: { message: string },
) => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigReject', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionRefreshed = (
  id: string,
  multisig: TransactionMultisig,
) => ({
  type: ACTIONS.MULTISIG_TRANSACTION_REFRESHED,
  payload: { multisig },
  meta: { id },
});

export const multisigTransactionSign = (id: string) => ({
  type: ACTIONS.MULTISIG_TRANSACTION_SIGN,
  meta: { id },
});

export const multisigTransactionSigned = (id: string) => ({
  type: ACTIONS.MULTISIG_TRANSACTION_SIGNED,
  meta: { id },
});

export const multisigTransactionReject = (id: string) => ({
  type: ACTIONS.MULTISIG_TRANSACTION_REJECT,
  meta: { id },
});

export const transactionError = (id: string, error: TransactionError) => ({
  type: ACTIONS.TRANSACTION_ERROR,
  payload: error,
  error: true,
  meta: { id },
});

export const transactionReceiptReceived = <P: TransactionParams>(
  id: string,
  payload: {| receipt: TransactionReceipt, params: P |},
) => ({
  type: ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSent = <P: TransactionParams>(
  id: string,
  payload: {| hash: string, params: P |},
) => ({
  type: ACTIONS.TRANSACTION_SENT,
  payload,
  meta: { id },
});

export const transactionEventDataReceived = <
  P: TransactionParams,
  E: TransactionEventData,
>(
  id: string,
  payload: {| eventData: E, params: P |},
) => ({
  type: ACTIONS.TRANSACTION_SUCCEEDED,
  payload,
  meta: { id },
});

export const transactionAddIdentifier = (id: string, payload: string) => ({
  type: ACTIONS.TRANSACTION_ADD_IDENTIFIER,
  meta: { id },
  payload,
});

export const transactionAddParams = (id: string, payload: Object) => ({
  type: ACTIONS.TRANSACTION_ADD_PARAMS,
  meta: { id },
  payload,
});

export const transactionReady = (id: string) => ({
  type: ACTIONS.TRANSACTION_READY,
  meta: { id },
});

export const transactionEstimateGas = (id: string) => ({
  type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
  meta: { id },
});

export const transactionUpdateGas = (
  id: string,
  data: { gasLimit: BigNumber, gasPrice: BigNumber },
) => ({
  type: ACTIONS.TRANSACTION_GAS_UPDATE,
  payload: data,
  meta: { id },
});

export const transactionCancel = (id: string) => ({
  type: ACTIONS.TRANSACTION_CANCEL,
  meta: { id },
});

export const updateGasPrices = (gasPrices: GasPricesProps) => ({
  type: ACTIONS.GAS_PRICES_UPDATE,
  payload: gasPrices,
});
