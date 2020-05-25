import {
  Provider,
  TransactionReceipt,
  TransactionResponse,
} from 'ethers/providers';
import { buffers, END, eventChannel } from 'redux-saga';
import { ContractClient } from '@colony/colony-js';

import { MethodParams, RequireProps } from '~types/index';
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
// @TODO typing here is not great but I have no idea how to improve it atm
type TxSucceededEvent = {
  eventData: object;
  params: MethodParams;
  deployedContractAddress?: string;
};

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
    console.error(caughtError);
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
    console.error(caughtError);
    emit(transactionReceiptError(id, caughtError));
  }

  return null;
};

const channelGetEventData = async (
  { id, params }: TransactionRecord,
  receipt: TransactionReceipt,
  client,
  emit,
) => {
  try {
    debugger;
    // FIXME we add this once it comes up
    const eventData = {};
    const txSucceededEvent: TxSucceededEvent = {
      eventData,
      params,
      deployedContractAddress: undefined,
    };
    console.log(receipt);
    console.log(client);
    if (receipt.contractAddress) {
      txSucceededEvent.deployedContractAddress = receipt.contractAddress;
    }
    emit(transactionSucceeded(id, txSucceededEvent));
    return eventData;
  } catch (caughtError) {
    console.error(caughtError);
    emit(transactionEventDataError(id, caughtError));
  }

  return null;
};

const channelStart = async (
  tx: TransactionRecord,
  txPromise: Promise<TransactionResponse>,
  client: ContractClient,
  emit,
) => {
  try {
    const sentTx = await channelSendTransaction(tx, txPromise, emit);
    if (!sentTx) return null;

    const receipt = await channelGetTransactionReceipt(
      tx,
      sentTx,
      client.provider,
      emit,
    );
    if (!receipt) return null;

    if (receipt.status === 1) {
      await channelGetEventData(tx, receipt, client, emit);
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
  client: ContractClient,
) =>
  eventChannel((emit) => {
    channelStart(tx, txPromise, client, emit);
    return () => {};
  }, buffers.fixed());

export default transactionChannel;
