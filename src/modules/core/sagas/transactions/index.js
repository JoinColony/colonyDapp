/* @flow */

import { takeEvery } from 'redux-saga/effects';

import {
  refreshMultisigTransaction,
  rejectMultisigTransaction,
  signedMultisigTransaction,
  signMultisigTransaction,
} from './multisigTransaction';
import {
  MULTISIG_TRANSACTION_CREATED,
  MULTISIG_TRANSACTION_REJECT,
  MULTISIG_TRANSACTION_SIGN,
  MULTISIG_TRANSACTION_SIGNED,
  TRANSACTION_CREATED,
  TRANSACTION_ESTIMATE_GAS,
  TRANSACTION_SEND,
} from '../../actionTypes';

import onTransactionCreated from './onTransactionCreated';
import estimateGasCost from './estimateGasCost';
import onTransactionSent from './onTransactionSent';

export { default as createBatchTxRunner } from './batchTransaction';
export * from './createTransaction';

export default function* transactionsSagas(): any {
  /*
   * 1. TRANSACTION_CREATED
   * When new outgoing transactions are created, we run the corresponding lifecycle method, if it exists
   */
  yield takeEvery(TRANSACTION_CREATED, onTransactionCreated);
  /*
   * 2. TRANSACTION_ESTIMATE_GAS
   * After a user clicks on a transaction in the gas station, the gas limit and gas price are estimated
   */
  yield takeEvery(TRANSACTION_ESTIMATE_GAS, estimateGasCost);
  /*
   * 3. TRANSACTION_SEND
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(TRANSACTION_SEND, onTransactionSent);

  /* Multisig */
  yield takeEvery(MULTISIG_TRANSACTION_CREATED, refreshMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_SIGN, signMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_REJECT, rejectMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_SIGNED, signedMultisigTransaction);
}
