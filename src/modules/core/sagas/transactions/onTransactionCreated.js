/* @flow */

import type { Saga } from 'redux-saga';

import { put, select } from 'redux-saga/effects';

import type {
  TransactionParams,
  TransactionRecordType,
  TransactionEventData,
} from '~immutable';

import type { CreateTransactionAction } from '../../types';

import { ACTIONS } from '~redux';

import { oneTransaction } from '../../selectors';

export default function* onTransactionCreated<
  P: TransactionParams,
  E: TransactionEventData,
  // TODO replace this type with $PropertyType<ActionsType, 'TRANSACTION_CREATED'>
>({ meta: { id } }: CreateTransactionAction<P>): Saga<void> {
  const transaction: TransactionRecordType<P, E> = yield select(
    oneTransaction,
    id,
  );
  const {
    lifecycle: { created },
    methodName,
  } = transaction;
  if (created) {
    yield put({
      type: created,
      meta: { id },
      payload: { transaction },
    });
  }

  /*
   * @TODO This is temporary, remove once the new Create Colony Workflow is implemented
   *
   * Until then, this will automatically sign create colony related transactions.
   *
   * For the rest we follow the "normal" gas staion flow, by putting the transaction
   * in the ready state and waiting for the user to confirm it
   */
  if (
    process.env.SKIP_GAS_STATION_CONFIRM === 'true' ||
    /*
     * @TODO This is temporary, remove once the new Create Colony Workflow is implemented
     *
     * Until then, this will automatically sign create colony related transactions.
     *
     * For the rest we follow the "normal" gas staion flow, by putting the transaction
     * in the ready state and waiting for the user to confirm it
     */
    methodName === 'createToken' ||
    methodName === 'registerColonyLabel' ||
    methodName === 'createColony'
  ) {
    yield put({ type: ACTIONS.METHOD_TRANSACTION_SENT, meta: { id } });
  }
}
