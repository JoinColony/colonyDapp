/* @flow */

import type { Saga } from 'redux-saga';

import { takeEvery } from 'redux-saga/effects';

import { ACTIONS } from '~redux';

import {
  refreshMultisigTransaction,
  rejectMultisigTransaction,
  signedMultisigTransaction,
  signMultisigTransaction,
} from './multisigTransaction';

export * from './createTransaction';

export default function* transactionsSagas(): Saga<void> {
  /* Multisig */
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_CREATED,
    refreshMultisigTransaction,
  );
  yield takeEvery(ACTIONS.MULTISIG_TRANSACTION_SIGN, signMultisigTransaction);
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_REJECT,
    rejectMultisigTransaction,
  );
  yield takeEvery(
    ACTIONS.MULTISIG_TRANSACTION_SIGNED,
    signedMultisigTransaction,
  );
}
