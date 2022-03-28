import { call, put, take } from 'redux-saga/effects';
import { TransactionResponse } from 'ethers/providers';
import type { ContractClient, TransactionOverrides } from '@colony/colony-js';
import { ClientType } from '@colony/colony-js';
import { Contract } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';

import { ActionTypes } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';
import { mergePayload } from '~utils/actions';
import { TRANSACTION_STATUSES, TransactionRecord } from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action } from '~redux/types/actions';
import { ExtendedReduxContext } from '~types/index';

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

  let contextClient: ContractClient;
  if (context === ClientType.TokenClient) {
    contextClient = yield colonyManager.getTokenClient(identifier as string);
  } else if (
    context === ((ExtendedReduxContext.WrappedToken as unknown) as ClientType)
  ) {
    // @ts-ignore
    const wrappedTokenAbi = abis.WrappedToken.default.abi;
    contextClient = new Contract(
      identifier || '',
      wrappedTokenAbi,
      colonyManager.signer,
    );
  } else if (
    context === ((ExtendedReduxContext.VestingSimple as unknown) as ClientType)
  ) {
    // @ts-ignore
    const vestingSimpleAbi = abis.vestingSimple.default.abi;
    contextClient = new Contract(
      identifier || '',
      vestingSimpleAbi,
      colonyManager.signer,
    );
  } else {
    contextClient = yield colonyManager.getClient(context, identifier);
  }

  if (!contextClient) {
    throw new Error('Context client failed to instantiate');
  }

  // Create a promise to send the transaction with the given method.
  const txPromise = getMethodTransactionPromise(contextClient, transaction);

  const channel = yield call(
    transactionChannel,
    txPromise,
    transaction,
    contextClient,
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
