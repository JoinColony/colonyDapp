/* @flow */

import type { Saga } from 'redux-saga';

import { takeEvery, select, put } from 'redux-saga/effects';

import type { SendTransactionAction } from '../../types';

import sendMethodTransaction from './sendMethodTransaction';
import suggestMethodTransactionGas from './suggestMethodTransactionGas';
import {
  METHOD_TRANSACTION_SENT,
  TRANSACTION_CREATED,
  TRANSACTION_GAS_SUGGESTED,
} from '../../actionTypes';

// TODO replace me with the real gas station/wallet!
function* jimmysDiscountGas({
  payload: { id },
}: SendTransactionAction): Saga<void> {
  const {
    context,
    methodName,
    suggestedGasLimit,
    suggestedGasPrice,
  } = yield select(state => state.core.transactions.get(id));
//   if (
//     process.env.SKIP_GAS_STATION_CONFIRM === 'true' ||
//     // eslint-disable-next-line no-alert
//     window.confirm(
//       `Welcome to Jimmy’s Discount Gas
// ------------------------------------
// Send ${context}/${methodName} transaction?
// Gas limit: ${
//         suggestedGasLimit ? suggestedGasLimit.toNumber() : 'not set'
//       }, gas price: ${
//         suggestedGasPrice ? suggestedGasPrice.toNumber() : 'not set'
//       }`,
//     )
//   )
  // yield put({ type: METHOD_TRANSACTION_SENT, payload: { id } });
  yield put({ type: 'USERNAME_CREATE_PENDING' });
}

export default function* transactionsSagas(): any {
  /*
   * 1. TRANSACTION_CREATED
   * When new outgoing transactions are created, a saga is run to get
   * suggested gas values for the transaction.
   */
  yield takeEvery(TRANSACTION_CREATED, suggestMethodTransactionGas);
  /*
   * 2. TRANSACTION_GAS_SUGGESTED
   * TODO replace me with the real gas station/wallet!
   * When the suggested gas values have been set, this saga prompts the user
   * to send the transaction (then the next action is dispatched, to send it).
   */
  yield takeEvery(TRANSACTION_GAS_SUGGESTED, jimmysDiscountGas);
  /*
   * 3. METHOD_TRANSACTION_SENT
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(METHOD_TRANSACTION_SENT, sendMethodTransaction);
}
