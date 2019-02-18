/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import type { Action } from '~redux';

import { putError, takeFrom } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { ensureColonyIsInState, fetchColonyStore } from './shared';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

function* addColonyAdmin({
  payload: { newAdmin, ensName },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_ADD>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    const { walletAddress, username } = newAdmin.profile;

    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    const colonyAddress = store.get('address');
    const colonyAdmins = store.get('admins');

    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { user: walletAddress },
      options: {
        gasLimit: 500000,
      },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    /*
     * Dispatch the action to the admin in the Redux store
     *
     * @NOTE Add the new admin in a pending state
     * TODO: If anything here goes wrong we want to revert this I guess!
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        adminData: newAdmin.profile,
        username,
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

    yield call([store, store.set], 'admins', {
      ...colonyAdmins,
      [username]: {
        ...newAdmin.profile.toJS(),
        state: 'confirmed',
      },
    });

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
      meta,
      payload: { username },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* removeColonyAdmin({
  payload: { admin },
  meta: {
    keyPath: [ensName],
  },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_REMOVE>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);

    const { walletAddress, username } = admin;
    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, ensName);

    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    const colonyAddress = store.get('address');
    const colonyAdmins = store.get('admins');

    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'removeAdminRole',
      identifier: colonyAddress,
      params: {
        user: walletAddress,
      },
      options: {
        gasLimit: 500000,
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

    delete colonyAdmins[username];
    yield call([store, store.set], 'admins', colonyAdmins);

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

export default function* adminsSagas(): any {
  yield takeEvery(ACTIONS.COLONY_ADMIN_ADD, addColonyAdmin);
  yield takeEvery(ACTIONS.COLONY_ADMIN_REMOVE, removeColonyAdmin);
}
