/* @flow */

import type { Saga } from 'redux-saga';
import type { ContractResponse } from '@colony/colony-js-client';

import { call, put, take, select } from 'redux-saga/effects';

import type {
  TransactionRecordType,
  TransactionParams,
  TransactionEventData,
} from '~immutable';
import type { Action } from '~redux/types/actions';

import type { MultisigSender, Sender } from '../../types';

import { transactionError } from '../../actionCreators';
import { oneTransaction } from '../../selectors';

import { getMethod } from '../utils';

import transactionChannel from './transactionChannel';
import { ACTIONS } from '~redux';
import { selectAsJS } from '~utils/saga/effects';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getMethodTransactionPromise<
  P: TransactionParams,
  E: TransactionEventData,
>(
  method: Sender<P, E> | MultisigSender<P, E>,
  tx: TransactionRecordType<P, E>,
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
    const op = await method.restoreOperation(JSON.stringify(multisig));
    return op.send(sendOptions);
  }
  return method.send(params, sendOptions);
}

export default function* sendTransaction(id: string): Saga<void> {
  const transaction = yield* selectAsJS(oneTransaction, id);

  if (transaction.status !== 'ready') {
    throw new Error('Transaction is not ready to send.');
  }

  const { methodName, context, identifier } = transaction;
  const method = yield call(getMethod, context, methodName, identifier);

  // Create a promise to send the transaction with the given method.
  // TODO explore using `call` without `yield` to make this more testable.
  const txPromise = getMethodTransactionPromise(method, transaction);

  const channel = yield call(transactionChannel, txPromise, transaction);
  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const tx = yield* selectAsJS(oneTransaction, id);

      // Put the action to the store
      yield put({
        ...action,
        payload: {
          ...action.payload,
          transaction: tx,
        },
      });
    }
  } catch (error) {
    yield put<Action<typeof ACTIONS.TRANSACTION_ERROR>>(
      transactionError(id, error),
    );
  } finally {
    channel.close();
  }
}
