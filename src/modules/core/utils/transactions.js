/* @flow */

import nanoid from 'nanoid';

import type { ContractResponse } from '@colony/colony-js-client';

import { eventChannel, END } from 'redux-saga';

import { all, call, cancel, fork, put, race, take } from 'redux-saga/effects';

import type { Saga } from 'redux-saga';
import type { TransactionAction, Sender } from '../types';

import {
  sendTransaction as sendTransactionActionCreator,
  startTransaction,
  transactionEventDataError,
  transactionEventDataReceived,
  transactionReceiptError,
  transactionReceiptReceived,
  transactionSendError,
} from '../actionCreators';

import {
  TRANSACTION_EVENT_DATA_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_ERROR,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SEND_ERROR,
} from '../actionTypes/index';

/**
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
function transactionChannel<EventData>(
  txPromise: Promise<ContractResponse<EventData>>,
  transactionId: string,
) {
  return eventChannel(emit => {
    txPromise
      .then(
        ({
          eventDataPromise,
          meta: {
            receiptPromise,
            transaction: { hash },
          },
        }) => {
          emit(sendTransactionActionCreator(hash, transactionId));

          // XXX these promises will be present in the contract response, but
          // we need to check for them, because we're using the
          // `waitForMining: false` option when creating the promise.
          if (receiptPromise)
            receiptPromise
              .then(receipt => {
                emit(transactionReceiptReceived(hash, receipt));
              })
              .catch(receiptError => {
                emit(transactionReceiptError(hash, receiptError.message));
              });

          if (eventDataPromise)
            eventDataPromise
              .then(eventData => {
                emit(transactionEventDataReceived(hash, eventData));
                emit(END);
              })
              .catch(eventDataError => {
                emit(transactionEventDataError(hash, eventDataError.message));
              });
        },
      )
      .catch(sendError => {
        emit(transactionSendError(transactionId, sendError.message));
        emit(END);
      });
    return () => {};
  });
}

/**
 * Given a promise for sending a transaction, dispatch an event to start the
 * transaction, start a channel for it, and dispatch all channel actions.
 */
function* sendTransaction<Params: *>(
  txPromise: Promise<*>,
  { type, payload: { params, options } }: TransactionAction<Params>,
): * {
  // Used to track the state of the transaction if it receives a transactionHash
  const transactionId = nanoid();

  // Dispatch a generic action to start the transaction.
  yield put(startTransaction(transactionId, type, params, options));

  // Create an event channel to send the transaction.
  const channel = yield call(transactionChannel, txPromise, transactionId);

  try {
    // Take all actions the channel emits and dispatch them.
    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } finally {
    // Close the event channel when we receive an `END` event.
    channel.close();
  }
}

/**
 * Race a successful response (receipt and event data) against an
 * erroneous one (any event/receipt/send error).
 */
function* getTransactionResponse<EventData: *>(): Saga<*> {
  const {
    receiptAndEventData: [
      {
        payload: { receipt },
      },
      {
        payload: { eventData },
      },
    ] = [{ payload: {} }, { payload: {} }],
    error,
  }: {
    receiptAndEventData: [{ payload: Object }, { payload: EventData }],
    error?: Object,
  } = yield race({
    receiptAndEventData: all([
      take(TRANSACTION_RECEIPT_RECEIVED),
      take(TRANSACTION_EVENT_DATA_RECEIVED),
    ]),
    error: race([
      take(TRANSACTION_EVENT_DATA_ERROR),
      take(TRANSACTION_RECEIPT_ERROR),
      take(TRANSACTION_SEND_ERROR),
    ]),
  });

  return { receipt, eventData, error };
}

/**
 * Given a method and a transaction action, create a promise for sending the
 * transaction with the method.
 */
function getMethodTxPromise<Params: *>(
  method: Sender<Params>,
  { payload: { params, options } }: TransactionAction<Params>,
) {
  return method.send(
    params,
    Object.assign({}, options, { waitForMining: false }),
  );
}

/**
 * Given a contract method and an action to send a transaction, execute a task
 * to send the transaction, and return the transaction response.
 */
export default function* sendTransactionTask<Params: Object, EventData: Object>(
  method: Sender<Params>,
  action: TransactionAction<Params>,
): Saga<{ error?: Error, receipt?: Object, eventData?: EventData }> {
  let response;
  let task;
  try {
    // Create a promise to send the transaction with the given method/action.
    const txPromise = getMethodTxPromise(method, action);

    // Create a task to send the transaction for the given action.
    task = yield fork(sendTransaction, txPromise, action);

    // Get the successful/erroneous transaction response.
    response = yield call(getTransactionResponse);
  } finally {
    // Cancel the task (if we were able to start it successfully).
    if (task) yield cancel(task);
  }

  // Return the response object.
  return response;
}
