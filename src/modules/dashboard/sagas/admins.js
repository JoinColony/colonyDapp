/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import type { Action } from '~redux';

import { putError, takeFrom } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { singleUserSelector } from '../../users/selectors';

import { routerColonySelector } from '../selectors/colony';

function* colonyAdminAdd({
  payload: { newAdmin },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_ADD>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const colony = yield select(routerColonySelector);
    const { address } = colony.record;
    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: address,
      params: { user: newAdmin },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    const { record: admin } = yield select(singleUserSelector, newAdmin);

    /*
     * Dispatch the action to the admin in the Redux store
     *
     * @NOTE Add the new admin in a pending state
     * TODO: If anything here goes wrong we want to revert this I guess!
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        adminData: admin.profile,
        username: admin.profile.username,
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
      payload: { username: admin.profile.username },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* colonyAdminRemove({
  payload: { admin },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_REMOVE>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    const colony = yield select(routerColonySelector);
    const { address } = colony.record;
    const { walletAddress, username } = admin;

    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'removeAdminRole',
      identifier: address,
      params: {
        user: walletAddress,
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
      payload: { username },
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
      type: ACTIONS.COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
      meta,
      payload: { username },
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
