/* @flow */

import nanoid from 'nanoid';

import type { ContractResponse } from '@colony/colony-js-client';

import { eventChannel, END } from 'redux-saga';

import { all, call, put, race, take } from 'redux-saga/effects';

import type { Saga } from 'redux-saga';
import type { TransactionAction, LifecycleActionTypes } from '../../types';

import {
  sendTransaction as sendTransactionActionCreator,
  startTransaction,
  transactionEventDataError,
  transactionEventDataReceived,
  transactionReceiptError,
  transactionReceiptReceived,
  transactionSendError,
} from '../../actionCreators/index';

import {
  TRANSACTION_SENT,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
} from '../../actionTypes/index';

/**
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
export function transactionChannel<EventData>(
  txPromise: Promise<ContractResponse<EventData>>,
  id: string, // Transaction ID (not a hash, just for the store).
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
          emit(sendTransactionActionCreator(id, hash));

          // XXX these promises will be present in the contract response, but
          // we need to check for them, because we're using the
          // `waitForMining: false` option when creating the promise.
          if (receiptPromise)
            receiptPromise
              .then(receipt => {
                emit(transactionReceiptReceived(id, receipt));
              })
              .catch(receiptError => {
                emit(transactionReceiptError(id, receiptError.message));
              });

          if (eventDataPromise)
            eventDataPromise
              .then(eventData => {
                emit(transactionEventDataReceived(id, eventData));
                emit(END);
              })
              .catch(eventDataError => {
                emit(transactionEventDataError(id, eventDataError.message));
              });
        },
      )
      .catch(sendError => {
        emit(transactionSendError(id, sendError.message));
        emit(END);
      });
    return () => {};
  });
}

/**
 * Race a successful response (receipt and event data) against an
 * erroneous one (any event/receipt/send error).
 */
export function* getTransactionResponse<EventData: *>(): Saga<*> {
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
    error: take(TRANSACTION_ERROR),
  });

  return { receipt, eventData, error };
}

/**
 * Given a promise for sending a transaction, dispatch an event to start the
 * transaction, start a channel for it, and dispatch all channel actions.
 */
export function* sendTransaction<Params: *>(
  txPromise: Promise<*>,
  { type, payload: { params, options } }: TransactionAction<Params>,
  { started, sent, eventDataReceived, receiptReceived }: LifecycleActionTypes,
): * {
  // Used to track the state of the transaction before it receives
  // a `transactionHash` property
  const id = nanoid();

  // Dispatch a generic action to start the transaction.
  yield put(startTransaction(id, type, params, options));
  if (started) yield put(startTransaction(id, type, params, options, started));

  // Create an event channel to send the transaction.
  const channel = yield call(transactionChannel, txPromise, id);

  try {
    // Take all actions the channel emits and dispatch them.
    while (true) {
      const action = yield take(channel);
      const { payload } = action;

      switch (action.type) {
        case TRANSACTION_SENT:
          if (sent)
            yield put(transactionReceiptReceived(id, payload.receipt, sent));
          break;

        case TRANSACTION_RECEIPT_RECEIVED:
          if (receiptReceived)
            yield put(
              transactionReceiptReceived(id, payload.receipt, receiptReceived),
            );
          break;

        case TRANSACTION_EVENT_DATA_RECEIVED:
          if (eventDataReceived)
            yield put(
              transactionEventDataReceived(
                id,
                payload.eventData,
                eventDataReceived,
              ),
            );
          break;

        default:
          break;
      }

      yield put(action);
    }
  } finally {
    // Close the event channel when we receive an `END` event.
    channel.close();
  }
}
