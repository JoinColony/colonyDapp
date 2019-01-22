/* @flow */

import type { Saga } from 'redux-saga';
import type { ContractResponse } from '@colony/colony-js-client';

import { call, put, select, take } from 'redux-saga/effects';

import type {
  TransactionRecord,
  TransactionParams,
  TransactionEventData,
} from '~immutable';

import { putError } from '~utils/saga/effects';

import type { Sender, SendTransactionAction } from '../../types';

import {
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../../actionTypes';
import {
  transactionEventDataReceived,
  transactionReceiptReceived,
  transactionSent,
} from '../../actionCreators';
import { oneTransaction } from '../../selectors';

import { getMethod } from '../utils';

import transactionChannel from './transactionChannel';

/*
 * Given a transaction ID, get the matching record (if it exists and has not been sent)
 */
function* getUnsentTransaction<P: TransactionParams, E: TransactionEventData>(
  id: string,
): Generator<*, TransactionRecord<P, E>, *> {
  const tx: TransactionRecord<P, E> = yield select(oneTransaction, id);
  if (!tx) throw new Error('Transaction not found');
  if (tx.hash) throw new Error('Transaction has already been sent');
  return tx;
}

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getMethodTransactionPromise<
  P: TransactionParams,
  E: TransactionEventData,
>(
  method: Sender<P, E>,
  tx: TransactionRecord<P, E>,
): Promise<ContractResponse<E>> {
  const {
    multisig,
    options: {
      gasLimit: gasLimitOverride,
      gasPrice: gasPriceOverride,
      // $FlowFixMe (some options here are still required, like `value`).
      ...restOptions
    },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions = Object.assign(
    {
      gasLimit: gasLimitOverride || gasLimit,
      gasPrice: gasPriceOverride || gasPrice,
    },
    restOptions,
    { waitForMining: false },
  );
  if (method.restoreOperation && multisig) {
    // $FlowFixMe why do you not recognise this as being checked for existence?
    const op = await method.restoreOperation(JSON.stringify(multisig));
    return op.send(sendOptions);
  }
  return method.send(params, sendOptions);
}

/*
 * Given a transaction record and a promise for sending a transaction, start a
 * channel to send the transaction, and dispatch all channel actions.
 */
function* sendTransaction<P: TransactionParams, E: TransactionEventData>(
  txPromise: Promise<ContractResponse<E>>,
  id: string,
): Saga<void> {
  const transaction: TransactionRecord<P, E> = yield select(oneTransaction, id);

  const {
    lifecycle: { error: errorType, receiptReceived, sent, success },
  } = transaction;

  // Create an event channel to send the transaction.
  const channel = yield call(transactionChannel, txPromise, transaction);

  try {
    // Take all actions the channel emits and dispatch them.
    while (true) {
      const action = yield take(channel);

      // Add the transaction to the payload
      const payload = {
        ...action.payload,
        transaction,
      };

      // Put the action to the store
      yield put({
        ...action,
        payload,
      });

      // Handle lifecycle action types
      switch (action.type) {
        case TRANSACTION_ERROR:
          if (errorType) yield put({ type: errorType, payload, meta: { id } });
          break;

        case TRANSACTION_SENT:
          if (sent) yield put(transactionSent(id, payload, sent));
          break;

        case TRANSACTION_RECEIPT_RECEIVED:
          if (receiptReceived)
            yield put(transactionReceiptReceived(id, payload, receiptReceived));
          break;

        case TRANSACTION_EVENT_DATA_RECEIVED:
          if (success)
            yield put(transactionEventDataReceived(id, payload, success));
          break;

        default:
          break;
      }
    }
  } finally {
    // Close the event channel when we receive an `END` event.
    channel.close();
  }
}

/*
 * Given a contract method and an action to send a transaction, execute a task
 * to send the transaction, and return the transaction response.
 */
export default function* onTransactionSent<
  P: TransactionParams,
  E: TransactionEventData,
>({ meta: { id } }: SendTransactionAction): Saga<void> {
  let tx;

  try {
    // Get the created (but not yet sent) transaction from the store.
    tx = yield call(getUnsentTransaction, id);

    // Get the method from the transactions's context/method name/colony identifier.
    const { methodName, context, identifier } = tx;
    const method: Sender<P, E> = yield call(
      getMethod,
      context,
      methodName,
      identifier,
    );

    // Create a promise to send the transaction with the given method.
    // TODO explore using `call` without `yield` to make this more testable.
    const txPromise = getMethodTransactionPromise<P, E>(method, tx);

    // Send the transaction.
    yield call(sendTransaction, txPromise, id);
  } catch (caughtError) {
    // Unexpected errors `put` the given error action...
    const { lifecycle: { error: errorType } = {} } = tx || {};
    if (errorType) {
      yield putError(errorType, caughtError);
    } else {
      // We still dispatch this error as a general TRANASACTION_ERROR
      yield putError(TRANSACTION_ERROR, caughtError);
    }
  }
}
