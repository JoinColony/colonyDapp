/* @flow */

import type { Saga } from 'redux-saga';

import { takeEvery, select, put } from 'redux-saga/effects';

import type { SendTransactionAction } from '../../types';

import sendMethodTransaction from './sendMethodTransaction';
import {
  METHOD_TRANSACTION_SENT,
  TRANSACTION_GAS_SUGGESTED,
} from '../../actionTypes';

// TODO replace me with the real gas station/wallet!
function* jimmysDiscountGas({
  payload: { id },
}: SendTransactionAction): Saga<void> {
  const { actionType, suggestedGasLimit, suggestedGasPrice } = yield select(
    state => state.core.transactions.get(id),
  );
  if (
    process.env.SKIP_GAS_STATION_CONFIRM === 'true' ||
    // eslint-disable-next-line no-alert
    window.confirm(
      `Welcome to Jimmy’s Discount Gas
------------------------------------
Send ${actionType} transaction?
Gas limit: ${
        suggestedGasLimit ? suggestedGasLimit.toNumber() : 'not set'
      }, gas price: ${
        suggestedGasPrice ? suggestedGasPrice.toNumber() : 'not set'
      }`,
    )
  )
    yield put({ type: METHOD_TRANSACTION_SENT, payload: { id } });
}

export default function* transactionsSagas(): any {
  /*
   * METHOD_TRANSACTION_SENT
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(METHOD_TRANSACTION_SENT, sendMethodTransaction);
  /*
   * TRANSACTION_GAS_SUGGESTED
   * TODO replace me with the real gas station/wallet!
   */
  yield takeEvery(TRANSACTION_GAS_SUGGESTED, jimmysDiscountGas);
}
