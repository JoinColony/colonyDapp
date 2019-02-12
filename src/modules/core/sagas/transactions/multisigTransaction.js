/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, select } from 'redux-saga/effects';

import type { ActionsType } from '~redux/types/actions';

import {
  multisigTransactionNonceError,
  multisigTransactionRefreshed,
  multisigTransactionRefreshError,
  multisigTransactionRejectError,
  multisigTransactionSigned,
  multisigTransactionSignError,
} from '../../actionCreators';
import { oneTransaction } from '../../selectors';
import { getMethod } from '../utils';

export function* refreshMultisigTransaction({
  meta: { id },
}: $PropertyType<ActionsType, 'MULTISIG_TRANSACTION_REFRESHED'>): Saga<void> {
  try {
    // fetch the method, check it's multisig
    const { methodName, context, identifier, multisig, params } = yield select(
      oneTransaction,
      id,
    );
    const method = yield call(getMethod, context, methodName, identifier);
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
    yield put(
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
}: $PropertyType<ActionsType, 'MULTISIG_TRANSACTION_SIGN'>): Saga<void> {
  try {
    // fetch from store
    const { methodName, context, identifier, multisig } = yield select(
      oneTransaction,
      id,
    );
    if (!multisig) throw new Error('Transaction is not multisig');

    // restore
    const method = yield call(getMethod, context, methodName, identifier);
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
    yield put(
      multisigTransactionRefreshed(id, {
        nonce,
        payload,
        signers,
        missingSignees,
        requiredSignees,
      }),
    );

    // dispatch multisig signed action
    yield put(multisigTransactionSigned(id));
  } catch (error) {
    yield put(multisigTransactionSignError(id, { message: error.message }));
  }
}

export function* rejectMultisigTransaction({
  meta: { id },
}: $PropertyType<ActionsType, 'MULTISIG_TRANSACTION_REJECT'>): Saga<void> {
  try {
    // TODO: tell the other signees we reject
  } catch (error) {
    yield put(multisigTransactionRejectError(id, { message: error.message }));
  }
}

export function* signedMultisigTransaction({
  meta: { id },
}: $PropertyType<ActionsType, 'MULTISIG_TRANSACTION_SIGNED'>): Saga<void> {
  try {
    // TODO: if there's any remaining required signees, distribute to them
  } catch (error) {
    yield put(multisigTransactionSignError(id, { message: error.message }));
  }
}
