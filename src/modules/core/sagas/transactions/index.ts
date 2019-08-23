import { takeEvery } from 'redux-saga/effects';

import { ActionTypes } from '~redux/index';

import {
  refreshMultisigTransaction,
  rejectMultisigTransaction,
  signedMultisigTransaction,
  signMultisigTransaction,
} from './multisigTransaction';

export * from './createTransaction';

export default function* transactionsSagas() {
  /* Multisig */
  yield takeEvery(
    ActionTypes.MULTISIG_TRANSACTION_CREATED,
    refreshMultisigTransaction,
  );
  yield takeEvery(
    ActionTypes.MULTISIG_TRANSACTION_SIGN,
    signMultisigTransaction,
  );
  yield takeEvery(
    ActionTypes.MULTISIG_TRANSACTION_REJECT,
    rejectMultisigTransaction,
  );
  yield takeEvery(
    ActionTypes.MULTISIG_TRANSACTION_SIGNED,
    signedMultisigTransaction,
  );
}
