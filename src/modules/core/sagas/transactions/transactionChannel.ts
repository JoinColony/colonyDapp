import {
  Provider,
  TransactionReceipt,
  TransactionResponse,
} from 'ethers/providers';
import { buffers, END, eventChannel } from 'redux-saga';

import { RequireProps } from '~types/index';
import { TransactionRecord } from '~immutable/index';

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

type TransactionResponseWithHash = RequireProps<TransactionResponse, 'hash'>;

const channelSendTransaction = async (
  { id, params }: TransactionRecord,
  txPromise: Promise<TransactionResponse>,
  emit,
) => {
  if (!txPromise) {
    emit(transactionSendError(id, new Error('No send promise found')));
    return null;
  }

  try {
    emit(transactionSent(id));
    const transaction = await txPromise;
    const { hash } = transaction;
    if (!hash) {
      emit(transactionSendError(id, new Error('No tx hash found')));
      return null;
    }
    emit(transactionHashReceived(id, { hash, params }));
    return transaction as TransactionResponseWithHash;
  } catch (caughtError) {
    emit(transactionSendError(id, caughtError));
  }

  return null;
};

const channelGetTransactionReceipt = async (
  { id, params }: TransactionRecord,
  { hash }: TransactionResponseWithHash,
  provider: Provider,
  emit,
) => {
  try {
    const receipt = await provider.getTransactionReceipt(hash);
    emit(transactionReceiptReceived(id, { receipt, params }));
    return receipt;
  } catch (caughtError) {
    emit(transactionReceiptError(id, caughtError));
  }

  return null;
};

const channelGetEventData = async (
  { id, params }: TransactionRecord,
  receipt: TransactionReceipt,
  emit,
) => {
  try {
    // FIXME we add this once it comes up
    const eventData = {};
    emit(transactionSucceeded(id, { eventData, params }));
    return eventData;
  } catch (caughtError) {
    emit(transactionEventDataError(id, caughtError));
  }

  return null;
};

const channelStart = async (
  tx: TransactionRecord,
  txPromise: Promise<TransactionResponse>,
  provider: Provider,
  emit,
) => {
  try {
    const sentTx = await channelSendTransaction(tx, txPromise, emit);
    if (!sentTx) return null;

    const receipt = await channelGetTransactionReceipt(
      tx,
      sentTx,
      provider,
      emit,
    );
    if (!receipt) return null;

    if (receipt.status === 1) {
      await channelGetEventData(tx, receipt, emit);
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
  txPromise: Promise<TransactionResponse>,
  tx: TransactionRecord,
  provider: Provider,
) =>
  eventChannel((emit) => {
    channelStart(tx, txPromise, provider, emit);
    return () => {};
  }, buffers.fixed());

export default transactionChannel;
