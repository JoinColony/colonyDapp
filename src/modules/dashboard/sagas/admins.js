/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import type { UniqueAction, UniqueActionWithKeyPath } from '~types';

import { putError, takeFrom } from '~utils/saga/effects';

import { ensureColonyIsInState, fetchColonyStore } from './shared';

import {
  COLONY_ADMIN_ADD,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
  COLONY_ADMIN_REMOVE,
  COLONY_ADMIN_REMOVE_SUCCESS,
  COLONY_ADMIN_REMOVE_ERROR,
  COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
} from '../actionTypes';

import {
  TRANSACTION_CREATED,
  TRANSACTION_SUCCEEDED,
} from '../../core/actionTypes';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

function* addColonyAdmin({
  payload: { newAdmin, ensName },
  meta,
}: UniqueAction): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const { walletAddress, username } = newAdmin.profile;
    const keyPath = [ensName, 'record', 'admins', username];

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

    yield takeFrom(txChannel, TRANSACTION_CREATED);

    /*
     * Dispatch the action to the admin in the Redux store
     *
     * @NOTE Add the new admin in a pending state
     * TODO: If anything here goes wrong we want to revert this I guess!
     */
    yield put({
      type: COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        adminData: newAdmin.profile,
      },
      meta: { keyPath },
    });

    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );

    yield takeFrom(txChannel, TRANSACTION_SUCCEEDED);

    yield call([store, store.set], 'admins', {
      ...colonyAdmins,
      [username]: {
        ...newAdmin.profile.toJS(),
        state: 'confirmed',
      },
    });

    yield put({
      type: COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
      meta: { keyPath },
    });
  } catch (error) {
    yield putError(COLONY_ADMIN_ADD_ERROR, error);
  } finally {
    txChannel.close();
  }
}

function* removeColonyAdmin({
  payload: { admin },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    const ensName = meta.keyPath[0];
    const { walletAddress, username } = admin;
    const keyPath = [ensName, 'record', 'admins', username];
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
    yield put({
      type: COLONY_ADMIN_REMOVE_SUCCESS,
      meta: { keyPath },
    });
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );

    yield takeFrom(txChannel, TRANSACTION_SUCCEEDED);

    delete colonyAdmins[username];
    yield call([store, store.set], 'admins', colonyAdmins);

    yield put({
      type: COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
      meta: { keyPath },
    });
  } catch (error) {
    yield putError(COLONY_ADMIN_REMOVE_ERROR, error);
  }
}

export default function* adminsSagas(): any {
  yield takeEvery(COLONY_ADMIN_ADD, addColonyAdmin);
  yield takeEvery(COLONY_ADMIN_REMOVE, removeColonyAdmin);
}
