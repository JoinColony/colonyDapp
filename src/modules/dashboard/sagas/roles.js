/* @flow */

import type { Saga } from 'redux-saga';
import { call, fork, put, takeEvery, select } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  executeQuery,
  putError,
  takeFrom,
  putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { getColonyRoles } from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';
import { walletAddressSelector } from '../../users/selectors';

import { fetchRoles } from '../actionCreators';

import {
  NOTIFICATION_EVENT_ADMIN_ADDED,
  NOTIFICATION_EVENT_ADMIN_REMOVED,
} from '~users/Inbox/events';

function* colonyRolesFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_ROLES_FETCH>) {
  try {
    const roles = yield* executeQuery(getColonyRoles, {
      metadata: { colonyAddress },
    });
    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_ROLES_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_ROLES_FETCH_SUCCESS,
      meta,
      payload: roles,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ROLES_FETCH_ERROR, error, meta);
  }
}

function* colonyAdminAdd({
  payload: { newAdmin, colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_ADD>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Get the current user's wallet address (we need that for notifications)
     */
    const walletAddress = yield select(walletAddressSelector);
    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: newAdmin, setTo: true },
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

    /*
     * Notification
     */
    yield putNotification({
      colonyAddress,
      event: NOTIFICATION_EVENT_ADMIN_ADDED,
      sourceUserAddress: walletAddress,
      targetUserAddress: newAdmin,
    });

    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

function* colonyAdminRemove({
  payload: { user, colonyAddress },
  payload,
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_REMOVE>): Saga<void> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    /*
     * Get the current user's wallet address (we need that for notifications)
     */
    const walletAddress = yield select(walletAddressSelector);

    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: user, setTo: false },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
      meta,
      payload,
    });

    /*
     * Notification
     */
    yield putNotification({
      colonyAddress,
      event: NOTIFICATION_EVENT_ADMIN_REMOVED,
      sourceUserAddress: walletAddress,
      targetUserAddress: user,
    });

    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADMIN_REMOVE_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
}

export default function* rolesSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ROLES_FETCH, colonyRolesFetch);
  yield takeEvery(ACTIONS.COLONY_ADMIN_ADD, colonyAdminAdd);
  yield takeEvery(ACTIONS.COLONY_ADMIN_REMOVE, colonyAdminRemove);
}
