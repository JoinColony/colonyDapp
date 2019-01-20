/* @flow */

import type { Saga } from 'redux-saga';
import BigNumber from 'bn.js';

import { call, put } from 'redux-saga/effects';

import type { TransactionParams } from '~immutable';
import type { CreateTransactionAction } from '../../types';

import { transactionGasSuggested } from '../../actionCreators/index';

import { getMethod, getGasPrice } from '../utils';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
const SAFE_GAS_LIMIT_MULTIPLIER = 1.1;

export default function* suggestMethodTransactionGas<P: TransactionParams>({
  payload: { context, methodName, identifier, params },
  meta: { id },
}: CreateTransactionAction<P>): Saga<void> {
  // Get the given method.
  const method = yield call(getMethod, context, methodName, identifier);

  // Estimate the gas limit with the method.
  const suggestedGasLimit = yield call([method, method.estimate], params);

  // Get the current gas price.
  const suggestedGasPrice = yield call(getGasPrice);

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
