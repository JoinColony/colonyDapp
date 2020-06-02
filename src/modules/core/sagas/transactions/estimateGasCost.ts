import { call, put } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';

import { ActionTypes, Action } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';
import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionRecordProps } from '~immutable/index';

import { oneTransaction } from '../../selectors';
import {
  transactionUpdateGas,
  transactionEstimateError,
} from '../../actionCreators';
import { getGasPrices } from '../utils';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
// Plus 10%
const SAFE_GAS_LIMIT_MULTIPLIER = bigNumberify(10);

export default function* estimateGasCost({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_ESTIMATE_GAS>) {
  try {
    // Get the given transaction
    const {
      context,
      methodName,
      identifier,
      params,
    }: TransactionRecordProps = yield selectAsJS(oneTransaction, id);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    const client = yield colonyManager.getClient(context, identifier);

    // Estimate the gas limit with the method.
    const estimatedGas = yield client.estimate[methodName](...params);

    const suggestedGasLimit = estimatedGas
      .div(SAFE_GAS_LIMIT_MULTIPLIER)
      .add(estimatedGas);

    const { network, suggested } = yield call(getGasPrices);

    yield put(
      transactionUpdateGas(id, {
        gasLimit: suggestedGasLimit.toString(),
        gasPrice: suggested || network,
      }),
    );
  } catch (error) {
    console.error(error);
    return yield put(transactionEstimateError(id, error));
  }
  return null;
}
