/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';

import { executeQuery, putError, takeFrom } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { getColonyAdmins } from '../../../data/service/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

import { fetchAdmins } from '../actionCreators';

import { getColonyContext } from './shared';

function* colonyAdminsFetch({
  payload: { ensName },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMINS_FETCH>) {
  try {
    const context = yield* getColonyContext(ensName);
    const admins = yield* executeQuery(context, getColonyAdmins);
    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMINS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_ADMINS_FETCH_SUCCESS,
      meta,
      payload: admins,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMINS_FETCH_ERROR, error, meta);
  }
}

function* colonyAdminAdd({
  payload: { newAdmin, colonyENSName },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_ADD>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyENSName,
      params: { user: newAdmin },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Dispatch the action to the admin in the Redux store;
     * add the new admin in a pending state.
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
      payload: { user: newAdmin },
      meta,
    });

    yield put(fetchAdmins(colonyENSName));
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* colonyAdminRemove({
  payload: { user, colonyENSName },
  payload,
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_REMOVE>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);

    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'removeAdminRole',
      identifier: colonyENSName,
      params: { user },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
      meta,
      payload,
    });

    yield put(fetchAdmins(colonyENSName));
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_REMOVE_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

export default function* adminsSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADMINS_FETCH, colonyAdminsFetch);
  yield takeEvery(ACTIONS.COLONY_ADMIN_ADD, colonyAdminAdd);
  yield takeEvery(ACTIONS.COLONY_ADMIN_REMOVE, colonyAdminRemove);
}
