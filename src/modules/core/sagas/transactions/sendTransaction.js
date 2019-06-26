/* @flow */

import type { Saga } from 'redux-saga';
import type { ContractResponse } from '@colony/colony-js-client';
import { call, put, take } from 'redux-saga/effects';

import { ACTIONS } from '~redux';
import { isDev } from '~utils/debug';
import { selectAsJS } from '~utils/saga/effects';
import { mergePayload } from '~utils/actions';

import type { TransactionRecordType } from '~immutable';
import type { Action } from '~redux/types/actions';

import type { MultisigSender, Sender } from '../../types';

import { transactionError } from '../../actionCreators';
import { oneTransaction } from '../../selectors';
import { getTransactionMethod } from '../utils';

import transactionChannel from './transactionChannel';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getMethodTransactionPromise(
  method: Sender | MultisigSender,
  tx: TransactionRecordType,
): Promise<ContractResponse<*>> {
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
    /*
     * Use a 30s timeout for dev mode only
     */
    isDev ? { timeoutMs: 30 * 1000 } : {},
    { waitForMining: false },
  );
  if (method.restoreOperation && multisig) {
    const op = await method.restoreOperation(JSON.stringify(multisig));
    return op.send(sendOptions);
  }
  return method.send(params, sendOptions);
}

export default function* sendTransaction({
  meta: { id },
}: Action<typeof ACTIONS.TRANSACTION_SEND>): Saga<void> {
  const transaction = yield* selectAsJS(oneTransaction, id);

  if (transaction.status !== 'ready') {
    throw new Error('Transaction is not ready to send.');
  }

  const method = yield call(getTransactionMethod, transaction);

  // Create a promise to send the transaction with the given method.

  // We can explore using `call` without `yield` to make this more testable.
  const txPromise = getMethodTransactionPromise(method, transaction);

  const channel = yield call(transactionChannel, txPromise, transaction);

  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const currentTransaction = yield* selectAsJS(oneTransaction, id);

      // Put the action to the store
      yield put(mergePayload({ transaction: currentTransaction })(action));
    }
  } catch (error) {
    yield put(transactionError(id, 'send', error));
  } finally {
    channel.close();
  }
}
