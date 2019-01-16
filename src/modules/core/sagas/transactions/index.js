/* @flow */

import { takeEvery } from 'redux-saga/effects';

import sendMethodTransaction from './sendMethodTransaction';
import suggestMethodTransactionGas from './suggestMethodTransactionGas';
import readyMethodTransaction from './readyMethodTransaction';
import {
  refreshMultisigTransaction,
  rejectMultisigTransaction,
  signedMultisigTransaction,
  signMultisigTransaction,
} from './multisigTransaction';
import {
  METHOD_TRANSACTION_SENT,
  MULTISIG_TRANSACTION_CREATED,
  MULTISIG_TRANSACTION_REJECT,
  MULTISIG_TRANSACTION_SIGN,
  MULTISIG_TRANSACTION_SIGNED,
  TRANSACTION_CREATED,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_SUGGEST_GAS,
} from '../../actionTypes';

export default function* transactionsSagas(): any {
  /*
   * 1. TRANSACTION_CREATED
   * When new outgoing transactions are created, a saga is run to get
   * suggested gas values for the transaction.
   */
  yield takeEvery(
    [TRANSACTION_CREATED, TRANSACTION_SUGGEST_GAS],
    suggestMethodTransactionGas,
  );
  /*
   * 2. TRANSACTION_GAS_SUGGESTED -> TRANSACTION_READY
   *
   * After gas sa been suggested we consider the transaction to be "ready" to sign
   * and we dispatch that action.
   *
   * This action's role is to inform the `ActionForm` in the various components
   * that the trnsaction is ready to sign, so that it can act upon it. Eg: close the current modal
   *
   * This will be hooked into the `success` prop of the `ActionForm`
   */
  yield takeEvery(TRANSACTION_GAS_SUGGESTED, readyMethodTransaction);
  /*
   * 3. METHOD_TRANSACTION_SENT
   * is responsible for sending transactions which have been created with
   * a specific method, for a specific client.
   */
  yield takeEvery(METHOD_TRANSACTION_SENT, sendMethodTransaction);

  /* Multisig */
  yield takeEvery(MULTISIG_TRANSACTION_CREATED, refreshMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_SIGN, signMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_REJECT, rejectMultisigTransaction);
  yield takeEvery(MULTISIG_TRANSACTION_SIGNED, signedMultisigTransaction);
}
