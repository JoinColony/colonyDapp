/* @flow */

import type { Saga } from 'redux-saga';

import { cancel, call, fork } from 'redux-saga/effects';

import type {
  Sender,
  TransactionAction,
  LifecycleActionTypes,
} from '../../types';

import { getTransactionResponse, sendTransaction } from './sendTransaction';

/**
 * Given a method and a transaction action, create a promise for sending the
 * transaction with the method.
 */
function getMethodTxPromise<Params: *, EventData: *>(
  method: Sender<Params, EventData>,
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
export default function* sendMethodTransaction<
  Params: Object,
  EventData: Object,
>(
  method: Sender<Params, EventData>,
  action: TransactionAction<Params>,
  lifecycleActionTypes: LifecycleActionTypes,
): Saga<{ error?: Error, receipt?: Object, eventData?: EventData }> {
  let response;
  let task;
  try {
    // Create a promise to send the transaction with the given method/action.
    const txPromise = getMethodTxPromise(method, action);

    // Create a task to send the transaction for the given action.
    task = yield fork(sendTransaction, txPromise, action, lifecycleActionTypes);

    // Get the successful/erroneous transaction response.
    response = yield call(getTransactionResponse);
  } finally {
    // Cancel the task (if we were able to start it successfully).
    if (task) yield cancel(task);
  }

  // Return the response object.
  return response;
}
