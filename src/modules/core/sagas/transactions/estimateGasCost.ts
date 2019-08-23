import { call, put } from 'redux-saga/effects';

import { ActionTypes, Action } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';

import { oneTransaction } from '../../selectors';
import {
  transactionUpdateGas,
  transactionEstimateError,
} from '../../actionCreators';
import { getTransactionMethod, getGasPrices } from '../utils';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
const SAFE_GAS_LIMIT_MULTIPLIER = 1.1;

export default function* estimateGasCost({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_ESTIMATE_GAS>) {
  try {
    // Get the given transaction
    const transaction = yield selectAsJS(oneTransaction, id);

    const method = yield call(getTransactionMethod, transaction);

    // Estimate the gas limit with the method.
    const estimatedGas = yield call(
      [method, method.estimate],
      transaction.params,
    );

    // The suggested gas limit (briefly above the estimated gas cost)
    const suggestedGasLimit = Math.ceil(
      estimatedGas.toNumber() * SAFE_GAS_LIMIT_MULTIPLIER,
    ).toString();

    const { network, suggested } = yield call(getGasPrices);

    yield put(
      transactionUpdateGas(id, {
        gasLimit: suggestedGasLimit,
        gasPrice: suggested || network,
      }),
    );
  } catch (error) {
    return yield put(transactionEstimateError(id, error));
  }
  return null;
}
