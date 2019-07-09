/* @flow */

import type { Saga } from 'redux-saga';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  executeQuery,
  putError,
  takeFrom,
  putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import { decorateLog } from '~utils/web3/eventLogs/events';
import { getContext, CONTEXT } from '~context';
import { normalizeTransactionLog } from '~data/normalizers';

import { getColonyRoles } from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

import { fetchRoles } from '../actionCreators';

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
    return yield putError(ACTIONS.COLONY_ROLES_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyAdminAdd({
  payload: { newAdmin, colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_ADD>): Saga<*> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Set the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: newAdmin, setTo: true },
    });

    const {
      payload: {
        transaction: {
          receipt: {
            logs: [colonyRoleSetLog],
          },
        },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Dispatch the action to the admin in the Redux store;
     * add the new admin in a pending state.
     */
    yield put<Action<typeof ACTIONS.COLONY_ADMIN_ADD_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_ADD_SUCCESS,
      payload: { user: newAdmin },
      meta,
    });

    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );

    /*
     * Notification
     */
    const decoratedLog = yield call(
      decorateLog,
      colonyClient,
      colonyRoleSetLog,
    );
    yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    return yield putError(ACTIONS.COLONY_ADMIN_ADD_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

function* colonyAdminRemove({
  payload: { user, colonyAddress },
  payload,
  meta,
}: Action<typeof ACTIONS.COLONY_ADMIN_REMOVE>): Saga<*> {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, meta.id);
    /*
     * Remove the admin on the contract level (transaction)
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'setAdminRole',
      identifier: colonyAddress,
      params: { address: user, setTo: false },
    });

    const {
      payload: {
        transaction: {
          receipt: {
            logs: [colonyRoleSetLog],
          },
        },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put<Action<typeof ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS>>({
      type: ACTIONS.COLONY_ADMIN_REMOVE_SUCCESS,
      meta,
      payload,
    });

    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );

    /*
     * Notification
     */
    const decoratedLog = yield call(
      decorateLog,
      colonyClient,
      colonyRoleSetLog,
    );
    yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));
    yield put(fetchRoles(colonyAddress));
  } catch (error) {
    return yield putError(ACTIONS.COLONY_ADMIN_REMOVE_ERROR, error, meta);
  } finally {
    if (txChannel) txChannel.close();
  }
  return null;
}

export default function* rolesSagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ROLES_FETCH, colonyRolesFetch);
  yield takeEvery(ACTIONS.COLONY_ADMIN_ADD, colonyAdminAdd);
  yield takeEvery(ACTIONS.COLONY_ADMIN_REMOVE, colonyAdminRemove);
}
