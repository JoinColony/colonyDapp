/* @flow */

import type { Saga } from 'redux-saga';

import { call, put } from 'redux-saga/effects';

import { ACTIONS } from '~redux';
import { selectAsJS } from '~utils/saga/effects';

import type { Action } from '~redux';

import {
  multisigTransactionNonceError,
  multisigTransactionRefreshed,
  multisigTransactionRefreshError,
  multisigTransactionRejectError,
  multisigTransactionSigned,
  multisigTransactionSignError,
} from '../../actionCreators';
import { oneTransaction } from '../../selectors';
import { getTransactionMethod } from '../utils';

export function* refreshMultisigTransaction({
  meta: { id },
}: Action<typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED>): Saga<void> {
  try {
    // fetch the method, check it's multisig
    const transaction = yield* selectAsJS(oneTransaction, id);
    const { methodName, multisig, params } = transaction;
    const method = yield call(getTransactionMethod, transaction);
    if (!method.restoreOperation)
      throw new Error(`"${methodName}" is not a multisig method`);

    // if we have some multisig data already then restore, otherwise start op
    const multisigOperation = yield multisig
      ? call([method, method.restoreOperation], JSON.stringify(multisig))
      : call([method, method.startOperation], params);

    // get the updated values and put into state
    const {
      _nonce: nonce,
      payload,
      _signers: signers,
      missingSignees,
      requiredSignees,
    } = multisigOperation;
    yield put<Action<typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED>>(
      multisigTransactionRefreshed(id, {
        nonce,
        payload,
        signers,
        missingSignees,
        requiredSignees,
      }),
    );

    // if the nonce was invalidated, the tx has been reset
    if (multisig && multisig.nonce !== nonce)
      yield put(
        multisigTransactionNonceError(id, {
          message: 'Multisig nonce changed',
        }),
      );
  } catch (error) {
    yield put(multisigTransactionRefreshError(id, { message: error.message }));
  }
}

export function* signMultisigTransaction({
  meta: { id },
}: Action<typeof ACTIONS.MULTISIG_TRANSACTION_SIGN>): Saga<void> {
  try {
    // fetch from store
    const transaction = yield* selectAsJS(oneTransaction, id);
    const { methodName, multisig } = transaction;
    if (!multisig) throw new Error('Transaction is not multisig');

    // restore
    const method = yield call(getTransactionMethod, transaction);
    if (!method.restoreOperation)
      throw new Error(`"${methodName}" is not a multisig method`);
    const multisigOperation = yield call(
      [method, method.restoreOperation],
      JSON.stringify(multisig),
    );

    // sign ourself
    yield call([multisigOperation, multisigOperation.sign]);

    // we've refreshed it in the process, update the state
    const {
      _nonce: nonce,
      payload,
      _signers: signers,
      missingSignees,
      requiredSignees,
    } = multisigOperation;
    yield put<Action<typeof ACTIONS.MULTISIG_TRANSACTION_REFRESHED>>(
      multisigTransactionRefreshed(id, {
        nonce,
        payload,
        signers,
        missingSignees,
        requiredSignees,
      }),
    );

    // dispatch multisig signed action
    yield put<Action<typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED>>(
      multisigTransactionSigned(id),
    );
  } catch (error) {
    yield put(multisigTransactionSignError(id, { message: error.message }));
  }
}

export function* rejectMultisigTransaction({
  meta: { id },
}: Action<typeof ACTIONS.MULTISIG_TRANSACTION_REJECT>): Saga<void> {
  try {
    /**
     * @todo Handle multisig rejection actions.
     * @body Tell the other signees we rejected their sigs :(
     */
  } catch (error) {
    yield put(multisigTransactionRejectError(id, { message: error.message }));
  }
}

export function* signedMultisigTransaction({
  meta: { id },
}: Action<typeof ACTIONS.MULTISIG_TRANSACTION_SIGNED>): Saga<void> {
  try {
    /**
     * @todo Handle multisig signing actions.
     * @body If there are any remaining required signees, distribute to them
     */
  } catch (error) {
    yield put(multisigTransactionSignError(id, { message: error.message }));
  }
}
