/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import type { Action } from '~redux';

import { putError, takeFrom } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

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

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    /*
     * Dispatch the action to the admin in the Redux store;
     * add the new admin in a pending state.
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        userAddress: newAdmin,
      },
      meta,
    });

    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
      meta,
      payload: { userAddress: newAdmin },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, {
      ...meta,
      newAdmin,
    });
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* colonyAdminRemove({
  payload: { userAddress, colonyENSName },
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
      params: {
        user: userAddress,
      },
    });

    /*
     * Dispatch the action to the admin in the Redux store
     *
     * @NOTE Don't actually remove the admin, just set the state to pending
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
      meta,
      payload,
    });
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_REMOVE_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

export default function* adminsSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADMIN_ADD, colonyAdminAdd);
  yield takeEvery(ACTIONS.COLONY_ADMIN_REMOVE, colonyAdminRemove);
}
