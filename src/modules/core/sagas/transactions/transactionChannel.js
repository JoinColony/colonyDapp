/* @flow */

import type { ContractResponse } from '@colony/colony-js-client';

import { END, eventChannel } from 'redux-saga';

import type {
  TransactionRecord,
  TransactionParams,
  TransactionEventData,
} from '~types/index';

import { isDev } from '~utils/debug';

import {
  transactionEventDataError,
  transactionEventDataReceived,
  transactionReceiptError,
  transactionReceiptReceived,
  transactionSendError,
  transactionSent,
  transactionUnsuccessfulError,
} from '../../actionCreators';

const channelSendTransaction = async ({ id, params }, txPromise, emit) => {
  try {
    const result = await txPromise;
    const { hash } = result.meta.transaction;
    emit(transactionSent(id, { hash, params }));
    return result;
  } catch (e) {
    if (isDev) console.error(e);
    emit(transactionSendError(id, { message: e.message, params }));
  }
  return null;
};

const channelGetTransactionReceipt = async ({ id, params }, sentTx, emit) => {
  const {
    meta: { receiptPromise },
  } = sentTx;
  if (receiptPromise) {
    try {
      const receipt = await receiptPromise;
      emit(transactionReceiptReceived(id, { receipt, params }));
      return receipt;
    } catch (e) {
      if (isDev) console.error(e);
      emit(transactionReceiptError(id, { message: e.message, params }));
    }
  } else {
    emit(
      transactionReceiptError(id, { message: 'No receipt promise', params }),
    );
  }
  return null;
};

const channelGetEventData = async ({ id, params }, sentTx, emit) => {
  const { eventDataPromise } = sentTx;
  if (eventDataPromise) {
    try {
      const eventData = await eventDataPromise;
      emit(transactionEventDataReceived(id, { eventData, params }));
    } catch (e) {
      if (isDev) console.error(e);
      emit(transactionEventDataError(id, { message: e.message, params }));
    }
  } else {
    emit(transactionReceiptError(id, { message: 'No event promise', params }));
  }
};

const channelStart = async (tx, txPromise, emit) => {
  const { id, params } = tx;

  const sentTx = await channelSendTransaction(tx, txPromise, emit);
  if (!sentTx) return emit(END);

  const receipt = await channelGetTransactionReceipt(tx, sentTx, emit);
  if (!receipt) return emit(END);

  if (receipt.status === 1) {
    await channelGetEventData(tx, sentTx, emit);
  } else {
    // If the receipt was received but the tx wasn't successful,
    // emit an error event and stop the channel.
    emit(
      transactionUnsuccessfulError(id, {
        // TODO use revert reason strings (once supported)
        message: 'The transaction was unsuccessful',
        params,
      }),
    );
  }
  return emit(END);
};

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
const transactionChannel = <P: TransactionParams, E: TransactionEventData>(
  txPromise: Promise<ContractResponse<E>>,
  tx: TransactionRecord<P, E>,
) =>
  eventChannel(emit => {
    channelStart(tx, txPromise, emit);
    return () => {};
  });

export default transactionChannel;
