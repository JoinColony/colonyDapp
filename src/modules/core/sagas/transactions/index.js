/* @flow */

import type { Saga } from 'redux-saga';

import { takeEvery, put } from 'redux-saga/effects';

import sendMethodTransaction from './sendMethodTransaction';
import suggestMethodTransactionGas from './suggestMethodTransactionGas';
import {
  METHOD_TRANSACTION_SENT,
  TRANSACTION_CREATED,
  TRANSACTION_GAS_SUGGESTED,
} from '../../actionTypes';
import { USERNAME_CREATE_PENDING } from '../../../users/actionTypes';

/*
 * @TODO Make nicer
 *
 * Call the username create pending action type in order to close the claim
 * username modal, so that we can control the Gas Station
 */
function* jimmysDiscountGas(): Saga<void> {
  yield put({ type: USERNAME_CREATE_PENDING });
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
