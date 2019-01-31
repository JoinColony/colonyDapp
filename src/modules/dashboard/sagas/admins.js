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
  COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
  COLONY_ADMIN_ADD_CONFIRM_ERROR,
  COLONY_ADMIN_REMOVE,
  COLONY_ADMIN_REMOVE_SUCCESS,
  COLONY_ADMIN_REMOVE_ERROR,
  COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
  COLONY_ADMIN_REMOVE_CONFIRM_ERROR,
} from '../actionTypes';
import { TRANSACTION_EVENT_DATA_RECEIVED } from '../../core/actionTypes';

import {
  addColonyAdmin as addColonyAdminAction,
  removeColonyAdmin as removeColonyAdminAction,
} from '../actionCreators';

function* addColonyAdmin({
  payload: { newAdmin, ensName },
  meta = {},
}: Action): Saga<void> {
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
     * Dispatch the action to the admin in th redux store
     *
     * @NOTE Add the new admin in a peding state
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
    /*
     * Wait for the transaction to be signed
     * Only update the DDB and Redux stores once the transaction has been signed.
     *
     * We know this, because we listen for the `TRANSACTION_EVENT_DATA_RECEIVED`
     * which we receive once the transaction has been sucessfully signed.
     * Once that action is triggerred we inspect it and check it against the
     * id of our original transaction.
     * If they match, then we can be sure the transaction has been signed, so we
     * can safely update the stores.
     */
    yield takeEvery(
      TRANSACTION_EVENT_DATA_RECEIVED,
      function* waitForSuccessfulTx({ meta: { id: signedTxId } = {} }: Action) {
        try {
          if (signedTxId === meta.id) {
            /*
             * Set the new value on the colony's store
             */
            yield call([store, store.set], 'admins', {
              ...colonyAdmins,
              [username]: {
                ...newAdmin.profile.toJS(),
                state: 'confirmed',
              },
            });
            /*
             * Dispatch the action to the admin in th redux store to confirm
             * the newly added admin and change the state
             */
            yield put({
              type: COLONY_ADMIN_ADD_CONFIRM_SUCCESS,
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
          }
        } catch (error) {
          yield putError(COLONY_ADMIN_ADD_CONFIRM_ERROR, error);
        }
      },
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_ADD_ERROR, error);
  }
}

function* removeColonyAdmin({
  payload: { admin },
  meta: { keyPath: metaKeyPath },
  meta,
}: Action): Saga<void> {
  try {
    const ensName = metaKeyPath[0];
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
     * Dispatch the action to the admin in th redux store
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
    /*
     * Wait for the transaction to be signed
     * Only update the DDB and Redux stores once the transaction has been signed.
     *
     * We know this, because we listen for the `TRANSACTION_EVENT_DATA_RECEIVED`
     * which we receive once the transaction has been sucessfully signed.
     * Once that action is triggerred we inspect it and check it against the
     * id of our original transaction.
     * If they match, then we can be sure the transaction has been signed, so we
     * can safely update the stores.
     */
    yield takeEvery(
      TRANSACTION_EVENT_DATA_RECEIVED,
      function* waitForSuccessfulTx({ meta: { id: signedTxId } = {} }: Action) {
        try {
          if (signedTxId === meta.id) {
            /*
             * Remove the colony admin and set the new value on the colony's store
             */
            delete colonyAdmins[username];
            yield call([store, store.set], 'admins', colonyAdmins);
            /*
             * Dispatch the action to the admin in th redux store to actually
             * remove the entry (the one that's in the pending state)
             */
            yield put({
              type: COLONY_ADMIN_REMOVE_CONFIRM_SUCCESS,
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
          }
        } catch (error) {
          yield putError(COLONY_ADMIN_REMOVE_CONFIRM_ERROR, error);
        }
      },
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_REMOVE_ERROR, error);
  }
}

export default function* adminsSagas(): any {
  yield takeEvery(COLONY_ADMIN_ADD, addColonyAdmin);
  yield takeEvery(COLONY_ADMIN_REMOVE, removeColonyAdmin);
}
