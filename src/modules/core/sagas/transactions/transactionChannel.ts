import { ContractResponse } from '@colony/colony-js-client';
import { buffers, END, eventChannel } from 'redux-saga';

import { TransactionRecordType } from '~immutable/index';

import {
  transactionSendError,
  transactionEventDataError,
  transactionReceiptError,
  transactionUnsuccessfulError,
  transactionReceiptReceived,
  transactionSent,
  transactionHashReceived,
  transactionSucceeded,
} from '../../actionCreators';

const channelSendTransaction = async ({ id, params }, txPromise, emit) => {
  if (!txPromise) {
    emit(transactionSendError(id, new Error('No send promise found')));
    return null;
  }

  try {
    emit(transactionSent(id));
    const result = await txPromise;
    const { hash } = result.meta.transaction;
    emit(transactionHashReceived(id, { hash, params }));
    return result;
  } catch (caughtError) {
    emit(transactionSendError(id, caughtError));
  }

  return null;
};

const channelGetTransactionReceipt = async (
  { id, params },
  { meta: { receiptPromise } },
  emit,
) => {
  if (!receiptPromise) {
    emit(transactionReceiptError(id, new Error('No receipt promise found')));
    return null;
  }

  try {
    const receipt = await receiptPromise;
    emit(transactionReceiptReceived(id, { receipt, params }));
    return receipt;
  } catch (caughtError) {
    emit(transactionReceiptError(id, caughtError));
  }

  return null;
};

const channelGetEventData = async (
  { id, params },
  { eventDataPromise },
  emit,
) => {
  if (!eventDataPromise) {
    emit(transactionEventDataError(id, new Error('No event promise found')));
    return null;
  }

  try {
    const eventData = await eventDataPromise;
    emit(transactionSucceeded(id, { eventData, params }));
    return eventData;
  } catch (caughtError) {
    emit(transactionEventDataError(id, caughtError));
  }

  return null;
};

const channelStart = async (tx, txPromise, emit) => {
  try {
    const sentTx = await channelSendTransaction(tx, txPromise, emit);
    if (!sentTx) return null;

    const receipt = await channelGetTransactionReceipt(tx, sentTx, emit);
    if (!receipt) return null;

    if (receipt.status === 1) {
      await channelGetEventData(tx, sentTx, emit);
    } else {
      /**
       * @todo Use revert reason strings (once supported) in transactions.
       */
      emit(
        transactionUnsuccessfulError(
          tx.id,
          new Error('The transaction was unsuccessful'),
        ),
      );
    }

    return null;
  } catch (caughtError) {
    // This is unlikely to happen, since the functions called have their own
    // error handling, but worth doing for sanity.
    emit(transactionUnsuccessfulError(tx.id, caughtError));
    return null;
  } finally {
    emit(END);
  }
};

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
const transactionChannel = (
  txPromise: Promise<ContractResponse<any>>,
  tx: TransactionRecordType,
) =>
  eventChannel(emit => {
    channelStart(tx, txPromise, emit);
    return () => {};
  }, buffers.fixed());

export default transactionChannel;
