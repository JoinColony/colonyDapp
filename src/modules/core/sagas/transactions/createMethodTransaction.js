/* @flow */

import type { Saga } from 'redux-saga';
import BigNumber from 'bn.js';

import nanoid from 'nanoid';
import { call, put } from 'redux-saga/effects';

import type { TransactionParams } from '~types/index';
import type { Sender, CreateTransactionAction } from '../../types';

import {
  transactionCreated,
  transactionGasSuggested,
} from '../../actionCreators/index';

import { getMethodFromContext } from '../utils/index';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
const SAFE_GAS_LIMIT_MULTIPLIER = 1.1;

function* suggestMethodTransactionGas<P: TransactionParams>(
  id: string,
  params: P,
  method: Sender<P, *>,
): Generator<*, *, *> {
  const suggestedGasLimit = yield call([method, method.estimate], params);
  const suggestedGasPrice = yield call([
    method.client.adapter.provider,
    method.client.adapter.provider.getGasPrice,
  ]);
  // XXX These are coerced to the same type of BigNumber because the
  // method/provider return different types of BigNumber.
  yield put(
    transactionGasSuggested(
      id,
      new BigNumber(
        parseInt(suggestedGasLimit.toNumber() * SAFE_GAS_LIMIT_MULTIPLIER, 10),
      ),
      new BigNumber(suggestedGasPrice.toNumber()),
    ),
  );
}

export default function* createMethodTransaction<P: TransactionParams>({
  payload: { contextName, lifecycleActionTypes, methodName, options, params },
}: CreateTransactionAction<P>): Saga<void> {
  // Used to track the state of the transaction before it receives
  // a `transactionHash` property.
  const id = nanoid();

  const method = yield call(getMethodFromContext, contextName, methodName);

  // Dispatch a generic action to create a draft transaction.
  yield put(
    transactionCreated({
      contextName,
      id,
      lifecycleActionTypes,
      methodName,
      options,
      params,
    }),
  );

  // If lifecycle action type for `created` was given, dispatch that action.
  const { created: overrideActionType } = lifecycleActionTypes;
  if (overrideActionType)
    yield put(
      transactionCreated({
        contextName,
        id,
        lifecycleActionTypes,
        methodName,
        options,
        overrideActionType,
        params,
      }),
    );

  yield call(suggestMethodTransactionGas, id, params, method);
}
