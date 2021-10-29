import { TransactionReceipt } from 'ethers/providers';

import { AllActions, ActionTypes } from '~redux/index';
import { MethodParams, TxConfig } from '~types/index';
import {
  GasPricesProps,
  TransactionError,
  TRANSACTION_STATUSES,
  TRANSACTION_ERRORS,
} from '~immutable/index';

export const createTransactionAction = (
  id: string,
  from: string,
  {
    context,
    group,
    identifier,
    methodContext,
    methodName,
    options,
    params = [],
    ready,
    metatransaction = false,
  }: TxConfig,
) => ({
  type: ActionTypes.TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodContext,
    methodName,
    options,
    params,
    status:
      ready === false
        ? TRANSACTION_STATUSES.CREATED
        : TRANSACTION_STATUSES.READY,
    metatransaction,
  },
  meta: { id },
});

const transactionError = (
  type: TransactionError['type'],
  id: string,
  error: Error,
): AllActions => ({
  type: ActionTypes.TRANSACTION_ERROR,
  payload: {
    error: {
      type,
      message: error.message || error.toString(),
    },
  },
  error: true,
  meta: { id },
});

export const transactionEstimateError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.ESTIMATE,
);

export const transactionEventDataError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.EVENT_DATA,
);

export const transactionReceiptError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.RECEIPT,
);

export const transactionSendError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.SEND,
);

export const transactionUnsuccessfulError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.UNSUCCESSFUL,
);

export const transactionReceiptReceived = (
  id: string,
  payload: { receipt: TransactionReceipt; params: MethodParams },
): AllActions => ({
  type: ActionTypes.TRANSACTION_RECEIPT_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSent = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_SENT,
  meta: { id },
});

export const transactionHashReceived = (
  id: string,
  payload: {
    hash: string;
    blockHash: string;
    blockNumber: number;
    params: MethodParams;
  },
): AllActions => ({
  type: ActionTypes.TRANSACTION_HASH_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSucceeded = (
  id: string,
  payload: {
    eventData: object;
    params: MethodParams;
    receipt: TransactionReceipt;
    deployedContractAddress?: string;
  },
): AllActions => ({
  type: ActionTypes.TRANSACTION_SUCCEEDED,
  payload,
  meta: { id },
});

export const transactionAddIdentifier = (
  id: string,
  identifier: string,
): AllActions => ({
  type: ActionTypes.TRANSACTION_ADD_IDENTIFIER,
  meta: { id },
  payload: { identifier },
});

export const transactionAddParams = (
  id: string,
  params: MethodParams,
): AllActions => ({
  type: ActionTypes.TRANSACTION_ADD_PARAMS,
  meta: { id },
  payload: { params },
});

export const transactionReady = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_READY,
  meta: { id },
});

export const transactionPending = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_PENDING,
  meta: { id },
});

export const transactionEstimateGas = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_ESTIMATE_GAS,
  meta: { id },
});

export const transactionUpdateGas = (
  id: string,
  data: { gasLimit?: string; gasPrice?: string },
): AllActions => ({
  type: ActionTypes.TRANSACTION_GAS_UPDATE,
  payload: data,
  meta: { id },
});

export const transactionLoadRelated = (
  id: string,
  loading: boolean,
): AllActions => ({
  type: ActionTypes.TRANSACTION_LOAD_RELATED,
  payload: { loading },
  meta: { id },
});

export const transactionCancel = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_CANCEL,
  meta: { id },
});

export const updateGasPrices = (gasPrices: GasPricesProps): AllActions => ({
  type: ActionTypes.GAS_PRICES_UPDATE,
  payload: gasPrices,
});

export const transactionSend = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_SEND,
  meta: { id },
});
