/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import type { Action } from '~types';

import { putError } from '~utils/saga/effects';

import { ensureColonyIsInState, fetchColonyStore } from './shared';

import {
  COLONY_ADMIN_ADD,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ADMIN_REMOVE,
  COLONY_ADMIN_REMOVE_SUCCESS,
  COLONY_ADMIN_REMOVE_ERROR,
} from '../actionTypes';

import {
  addColonyAdmin as addColonyAdminAction,
  removeColonyAdmin as removeColonyAdminAction,
} from '../actionCreators';

function* addColonyAdmin({
  payload: { newAdmin, ensName },
  meta,
}: Action): Saga<void> {
  try {
    const { walletAddress, username } = newAdmin.profile;
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    const colonyAddress = store.get('address');
    const colonyAdmins = store.get('admins');
    /*
     * Dispatch the action to the admin in th redux store
     */
    yield put({
      type: COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        ensName,
        adminData: newAdmin.profile,
      },
    });
    /*
     * Set the new value on the colony's store
     */
    yield call([store, store.set], 'admins', {
      ...colonyAdmins,
      [username]: newAdmin.profile,
    });
    /*
     * Dispatch the action to set the admin on the contract level (transaction)
     */
    yield put(
      addColonyAdminAction({
        identifier: colonyAddress,
        params: { user: walletAddress },
        options: {
          gasLimit: 500000,
        },
        meta,
      }),
    );
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_ADD_ERROR, error);
  }
}

function* removeColonyAdmin({
  payload: { admin, ensName },
  meta,
}: Action): Saga<void> {
  try {
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
     * Dispatch the action to the admin in th redux store
     */
    yield put({
      type: COLONY_ADMIN_REMOVE_SUCCESS,
      payload: {
        ensName,
        username,
      },
    });
    /*
     * Remove the colony admin and set the new value on the colony's store
     */
    delete colonyAdmins[username];
    yield call([store, store.set], 'admins', colonyAdmins);
    /*
     * Dispatch the action to set the admin on the contract level (transaction)
     */
    yield put(
      removeColonyAdminAction({
        identifier: colonyAddress,
        params: {
          user: walletAddress,
        },
        options: {
          gasLimit: 500000,
        },
        meta,
      }),
    );
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_REMOVE_ERROR, error);
  }
}

export default function* adminsSagas(): any {
  yield takeEvery(COLONY_ADMIN_ADD, addColonyAdmin);
  yield takeEvery(COLONY_ADMIN_REMOVE, removeColonyAdmin);
}
