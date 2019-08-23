import { $PropertyType } from 'utility-types';

import { AllActions, ActionTypes } from '~redux/index';
import { TransactionReceipt } from '~types/index';
import {
  GasPricesProps,
  TransactionError,
  TransactionMultisig,
  TRANSACTION_STATUSES,
  TRANSACTION_ERRORS,
} from '~immutable/index';

import { TxConfig } from '../types';

export {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../../lib/ColonyManager/constants';

export const createTxAction = (
  id: string,
  from: string,
  {
    context,
    group,
    identifier,
    methodContext,
    methodName,
    multisig: multisigConfig,
    options,
    params,
    ready,
  }: TxConfig,
) => ({
  type: multisigConfig
    ? ActionTypes.MULTISIG_TRANSACTION_CREATED
    : ActionTypes.TRANSACTION_CREATED,
  payload: {
    context,
    createdAt: new Date(),
    from,
    group,
    identifier,
    methodContext,
    methodName,
    multisig: typeof multisigConfig === 'boolean' ? {} : multisigConfig,
    options,
    params,
    status:
      ready === false
        ? TRANSACTION_STATUSES.CREATED
        : TRANSACTION_STATUSES.READY,
  },
  meta: { id },
});

const transactionError = (
  type: $PropertyType<TransactionError, 'type'>,
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

export const multisigTransactionRefreshError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_REFRESH,
);

export const multisigTransactionNonceError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_NONCE,
);

export const multisigTransactionSignError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_SIGN,
);

export const multisigTransactionRejectError = transactionError.bind(
  null,
  TRANSACTION_ERRORS.MULTISIG_REJECT,
);

export const multisigTransactionRefreshed = (
  id: string,
  multisig: TransactionMultisig,
): AllActions => ({
  type: ActionTypes.MULTISIG_TRANSACTION_REFRESHED,
  payload: { multisig },
  meta: { id },
});

export const multisigTransactionSign = (id: string): AllActions => ({
  type: ActionTypes.MULTISIG_TRANSACTION_SIGN,
  meta: { id },
});

export const multisigTransactionSigned = (id: string): AllActions => ({
  type: ActionTypes.MULTISIG_TRANSACTION_SIGNED,
  meta: { id },
});

export const multisigTransactionReject = (id: string): AllActions => ({
  type: ActionTypes.MULTISIG_TRANSACTION_REJECT,
  meta: { id },
});

export const transactionReceiptReceived = (
  id: string,
  payload: { receipt: TransactionReceipt; params: object },
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
  payload: { hash: string; params: object },
): AllActions => ({
  type: ActionTypes.TRANSACTION_HASH_RECEIVED,
  payload,
  meta: { id },
});

export const transactionSucceeded = (
  id: string,
  payload: { eventData: object; params: object },
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
  params: object,
): AllActions => ({
  type: ActionTypes.TRANSACTION_ADD_PARAMS,
  meta: { id },
  payload: { params },
});

export const transactionReady = (id: string): AllActions => ({
  type: ActionTypes.TRANSACTION_READY,
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
