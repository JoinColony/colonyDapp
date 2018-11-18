/* @flow */

import type { Saga } from 'redux-saga';
import type { ContractResponse } from '@colony/colony-js-client';

import { END, eventChannel } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';

import type {
  TransactionRecord,
  TransactionParams,
  TransactionEventData,
} from '~types/index';
import type { Sender, SendTransactionAction } from '../../types';

import {
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../../actionTypes/index';
import {
  transactionEventDataError,
  transactionEventDataReceived,
  transactionReceiptError,
  transactionReceiptReceived,
  transactionSendError,
  transactionSent,
  transactionUnsuccessfulError,
} from '../../actionCreators/index';
import { getMethodFromContext } from '../utils/index';

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
export const transactionChannel = <
  P: TransactionParams,
  E: TransactionEventData,
>(
  txPromise: Promise<ContractResponse<E>>,
  tx: TransactionRecord<P, E>,
) =>
  eventChannel(emit => {
    const { id, params } = tx;
    txPromise
      .then(
        ({
          eventDataPromise,
          meta: {
            receiptPromise,
            transaction: { hash },
          },
        }) => {
          emit(transactionSent(id, { hash, params }));

          // XXX these promises will be present in the contract response, but
          // we need to check for them, because we're using the
          // `waitForMining: false` option when creating the promise.
          if (receiptPromise)
            receiptPromise
              .then(receipt => {
                emit(transactionReceiptReceived(id, { params, receipt }));
                if (receipt.status === 1) {
                  // If the receipt received and the transaction was successful,
                  // wait for event data.
                  if (eventDataPromise) {
                    eventDataPromise
                      .then(eventData => {
                        emit(
                          transactionEventDataReceived(id, {
                            eventData,
                            params,
                          }),
                        );
                        emit(END);
                      })
                      .catch(eventDataError => {
                        emit(
                          transactionEventDataError(id, {
                            message: eventDataError.message,
                            params,
                          }),
                        );
                        emit(END);
                      });
                  }
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
                  emit(END);
                }
              })
              .catch(receiptError => {
                emit(
                  transactionReceiptError(id, {
                    message: receiptError.message,
                    params,
                  }),
                );
                emit(END);
              });
        },
      )
      .catch(sendError => {
        emit(transactionSendError(id, { message: sendError.message, params }));
        emit(END);
      });
    return () => {};
  });

/*
 * Given a transaction ID, get the matching record (if it exists and has not been sent)
 */
function* getUnsentTransaction<P: TransactionParams, E: TransactionEventData>(
  id: string,
): Generator<*, TransactionRecord<P, E>, *> {
  const tx: TransactionRecord<P, E> = yield select(state =>
    state.core.transactions.get(id),
  );
  if (!tx) throw new Error('Transaction not found');
  if (tx.hash) throw new Error('Transaction has already been sent');
  return tx;
}

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
const getMethodTransactionPromise = <
  P: TransactionParams,
  E: TransactionEventData,
>(
  method: Sender<P, E>,
  tx: TransactionRecord<P, E>,
) => {
  const {
    options: {
      gasLimit,
      gasPrice,
      // $FlowFixMe (some options here are still required, like `value`).
      ...restOptions
    },
    params,
    suggestedGasLimit,
    suggestedGasPrice,
  } = tx;
  return method.send(
    params,
    Object.assign(
      {
        gasLimit: gasLimit || suggestedGasLimit,
        gasPrice: gasPrice || suggestedGasPrice,
      },
      restOptions,
      { waitForMining: false },
    ),
  );
};

/*
 * Given a transaction record and a promise for sending a transaction, start a
 * channel to send the transaction, and dispatch all channel actions.
 */
function* sendTransaction<P: TransactionParams, E: TransactionEventData>(
  txPromise: Promise<ContractResponse<E>>,
  tx: TransactionRecord<P, E>,
): Generator<*, *, *> {
  let receipt;
  let eventData: E;

  const {
    id,
    lifecycleActionTypes: {
      error: errorType,
      eventDataReceived,
      receiptReceived,
      sent,
      success: successType,
    },
  } = tx;

  // Create an event channel to send the transaction.
  const channel = yield call(transactionChannel, txPromise, tx);

  try {
    let putSuccess = false;
    // Take all actions the channel emits and dispatch them.
    while (true) {
      const action = yield take(channel);

      // Put the action to the store as-is
      yield put(action);

      // Handle lifecycle action types
      const { payload } = action;
      switch (action.type) {
        case TRANSACTION_ERROR:
          if (errorType) yield put({ type: errorType, payload });
          break;

        case TRANSACTION_SENT:
          if (sent) yield put(transactionSent(id, payload, sent));
          break;

        case TRANSACTION_RECEIPT_RECEIVED:
          ({ receipt } = payload);
          if (receiptReceived)
            yield put(transactionReceiptReceived(id, payload, receiptReceived));
          break;

        case TRANSACTION_EVENT_DATA_RECEIVED:
          ({ eventData } = payload);
          if (eventDataReceived)
            yield put(
              transactionEventDataReceived(id, payload, eventDataReceived),
            );
          break;

        default:
          break;
      }

      if (successType && receipt && eventData && !putSuccess) {
        yield put({ type: successType, payload: { receipt, eventData } });
        putSuccess = true;
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
export default function* sendMethodTransaction<
  P: TransactionParams,
  E: TransactionEventData,
>({ payload: { id } }: SendTransactionAction): Saga<void> {
  let tx;

  try {
    // Get the created (but not yet sent) transaction from the store.
    tx = yield call(getUnsentTransaction, id);

    // Get the method from the transactions's context/method names.
    const { methodName, contextName } = tx;
    const method: Sender<P, E> = yield call(
      getMethodFromContext,
      contextName,
      methodName,
    );

    // Create a promise to send the transaction with the given method.
    // TODO explore using `call` without `yield` to make this more testable.
    const txPromise = getMethodTransactionPromise<P, E>(method, tx);

    // Send the transaction.
    yield call(sendTransaction, txPromise, tx);
  } catch (caughtError) {
    // Unexpected errors `put` the given error action...
    const { lifecycleActionTypes: { error: errorType } = {} } = tx || {};
    if (errorType) {
      yield put({ type: errorType, payload: caughtError });
    } else {
      // ...or re-throw if the error type was not found.
      throw caughtError;
    }
  }
}
