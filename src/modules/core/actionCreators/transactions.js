/* @flow */

import BigNumber from 'bn.js';
import nanoid from 'nanoid';

import type { ColonyContext, TransactionReceipt } from '~types';
import type {
  GasPricesProps,
  TransactionError,
  TransactionEventData,
  TransactionMultisig,
  TransactionParams,
} from '~immutable';

import type {
  CreateTransactionAction,
  LifecycleActionTypes,
  TxActionCreator,
  TxActionCreatorOptions,
} from '../types';

import { ACTIONS } from '~redux';

type TxFactoryOptions = {
  context: ColonyContext,
  group?: {
    key: string,
    id: string | string[],
    index: number,
  },
  lifecycle?: LifecycleActionTypes,
  methodName: string,
  multisig?: boolean,
};

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxActionCreator = <P: TransactionParams>({
  context,
  group,
  lifecycle = {},
  methodName,
  multisig: isMultisig = false,
}: TxFactoryOptions): TxActionCreator<P> => ({
  groupId,
  identifier,
  meta,
  multisig: multisigJSON,
  options,
  params,
  status,
}: TxActionCreatorOptions<P>): CreateTransactionAction<P> => {
  if (groupId && !group) {
    throw new Error(
      `No group found for batch transaction ${context}.${methodName}`,
    );
  }
  return {
    type: isMultisig
      ? ACTIONS.MULTISIG_TRANSACTION_CREATED
      : ACTIONS.TRANSACTION_CREATED,
    payload: {
      context,
      createdAt: new Date(),
      group: group ? { ...group, id: groupId } : undefined,
      identifier,
      lifecycle,
      methodName,
      multisig: isMultisig ? multisigJSON || {} : undefined,
      options,
      params,
      status,
    },
    meta: { id: meta.id || nanoid() },
  };
};

export const multisigTransactionRefreshError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigRefresh', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionNonceError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigNonce', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionSignError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_ERROR,
  payload: { type: 'multisigSign', ...payload },
  meta: { id },
  error: true,
});

export const multisigTransactionRejectError = (
  id: string,
  payload: { message: string },
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_ERROR,
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
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSent = <P: TransactionParams>(
  id: string,
  payload: {| hash: string, params: P |},
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_SENT,
  payload,
  meta: { id },
});

export const transactionEventDataReceived = <
  P: TransactionParams,
  E: TransactionEventData,
>(
  id: string,
  payload: {| eventData: E, params: P |},
  overrideActionType?: string,
) => ({
  type: overrideActionType || ACTIONS.TRANSACTION_SUCCEEDED,
  payload,
  meta: { id },
});

export const transactionAddProperties = (
  id: string,
  payload: {| identifier?: string, params?: Object |},
) => ({
  type: ACTIONS.TRANSACTION_ADD_PROPERTIES,
  meta: { id },
  payload,
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
