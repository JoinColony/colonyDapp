/* @flow */

import type { Saga } from 'redux-saga';

import BigNumber from 'bn.js';
import { call, put, select } from 'redux-saga/effects';

import type { ActionsType } from '~redux/types/actions';

import { oneTransaction } from '../../selectors';
import { transactionUpdateGas } from '../../actionCreators';
import { getMethod, getGasPrices } from '../utils';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
const SAFE_GAS_LIMIT_MULTIPLIER = 1.1;

export default function* onEstimateGasCost({
  meta: { id },
}: $PropertyType<ActionsType, 'TRANSACTION_ESTIMATE_GAS'>): Saga<void> {
  // Get the given transaction
  const { context, methodName, identifier, params } = yield select(
    oneTransaction,
    id,
  );

  const method = yield call(getMethod, context, methodName, identifier);

  // Estimate the gas limit with the method.
  const estimatedGas = yield call([method, method.estimate], params);

  // The suggested gas limit (briefly above the estimated gas cost)
  // Weird ethers BN conversion
  const suggestedGasLimit = new BigNumber(estimatedGas.toString())
    .muln(SAFE_GAS_LIMIT_MULTIPLIER * 10)
    .divn(10);

  const { network, suggested } = yield call(getGasPrices);

  yield put(
    transactionUpdateGas(id, {
      gasLimit: suggestedGasLimit,
      gasPrice: suggested || network,
    }),
  );
}
