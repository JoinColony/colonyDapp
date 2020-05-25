import { call, put, take } from 'redux-saga/effects';
import { TransactionResponse } from 'ethers/providers';
import type { ContractClient, TransactionOverrides } from '@colony/colony-js';

import { ActionTypes } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';
import { mergePayload } from '~utils/actions';
import { TRANSACTION_STATUSES, TransactionRecord } from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action } from '~redux/types/actions';

import { transactionSendError } from '../../actionCreators';
import { oneTransaction } from '../../selectors';

import transactionChannel from './transactionChannel';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getMethodTransactionPromise(
  // @TODO this is not great but I feel like we will replace this anyways at some point
  client: ContractClient,
  tx: TransactionRecord,
): Promise<TransactionResponse> {
  const {
    methodName,
    options: {
      gasLimit: gasLimitOverride,
      gasPrice: gasPriceOverride,
      ...restOptions
    },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions: TransactionOverrides = {
    gasLimit: gasLimitOverride || gasLimit,
    gasPrice: gasPriceOverride || gasPrice,
    ...restOptions,
  };
  return client[methodName](...[...params, sendOptions]);
}

export default function* sendTransaction({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_SEND>) {
  const transaction: TransactionRecord = yield selectAsJS(oneTransaction, id);

  const { status, context, identifier } = transaction;

  if (status !== TRANSACTION_STATUSES.READY) {
    throw new Error('Transaction is not ready to send.');
  }
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const client = yield colonyManager.getClient(context, identifier);

  // Create a promise to send the transaction with the given method.
  const txPromise = getMethodTransactionPromise(client, transaction);

  const channel = yield call(
    transactionChannel,
    txPromise,
    transaction,
    client,
  );

  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const currentTransaction = yield selectAsJS(oneTransaction, id);

      // Put the action to the store
      yield put(mergePayload({ transaction: currentTransaction })(action));
    }
  } catch (error) {
    console.error(error);
    yield put(transactionSendError(id, error));
  } finally {
    channel.close();
  }
}
