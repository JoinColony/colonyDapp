/* @flow */

import type { Saga } from 'redux-saga';

import { put, select } from 'redux-saga/effects';

import type {
  TransactionParams,
  TransactionRecord,
  TransactionEventData,
} from '~immutable';
import type { CreateTransactionAction } from '../../types';

import { METHOD_TRANSACTION_SENT, TRANSACTION_READY } from '../../actionTypes';

export default function* readyMethodTransaction<
  P: TransactionParams,
  E: TransactionEventData,
>({ meta: { id } }: CreateTransactionAction<P>): Saga<void> {
  const { methodName }: TransactionRecord<P, E> = yield select(state =>
    state.core.transactions.get(id),
  );
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
    yield put({ type: METHOD_TRANSACTION_SENT, meta: { id } });
  } else {
    /*
     * Dispatch a transaction ready action
     *
     * This action's role is to inform the `ActionForm` in the various components
     * that the trnsaction is ready to sign, so that it can act upon it. Eg: close the current modal
     *
     * This will be hooked into the `success` prop of the `ActionForm`
     */
    yield put({ type: TRANSACTION_READY, meta: { id } });
  }
}
