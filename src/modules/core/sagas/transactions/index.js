/* @flow */

import { takeEvery } from 'redux-saga/effects';

import sendMethodTransaction from './sendMethodTransaction';
import suggestMethodTransactionGas from './suggestMethodTransactionGas';
import {
  METHOD_TRANSACTION_SENT,
  TRANSACTION_CREATED,
} from '../../actionTypes';

export default function* transactionsSagas(): any {
  /*
   * 1. TRANSACTION_CREATED
   * When new outgoing transactions are created, a saga is run to get
   * suggested gas values for the transaction.
   */
  yield takeEvery(TRANSACTION_CREATED, suggestMethodTransactionGas);
  /*
   * 3. METHOD_TRANSACTION_SENT
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(METHOD_TRANSACTION_SENT, sendMethodTransaction);
}
