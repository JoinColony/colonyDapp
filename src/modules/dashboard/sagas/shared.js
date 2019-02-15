/* @flow */
import type { Saga } from 'redux-saga';

import { call, select, put } from 'redux-saga/effects';

import type { ENSName } from '~types';
import type { Action } from '~redux';
import type { DocStore, ValidatedKVStore } from '../../../lib/database/stores';

import { raceError } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { getColonyStore } from '../../../data/stores';
import { tasksIndexStoreBlueprint } from '../stores';
import { fetchColony } from '../actionCreators';
import { singleColonySelector } from '../selectors';

/*
 * Given a colony ENS name, fetch the colony store (if it exists).
 */
export function* fetchColonyStore(
  colonyENSName: ENSName,
): Saga<?ValidatedKVStore> {
  let store;
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyENSName,
  );
  const colonyStoreExists = yield call([ddb, ddb.storeExists], colonyENSName);
  if (colonyStoreExists) {
    store = yield call(getColonyStore(colonyClient, ddb, wallet), {
      colonyENSName,
      colonyAddress: colonyClient.contract.address,
    });
  }

  return store;
}

/*
 * Given a colony ENS name, ensure that colony is set in state;
 * if it does not exist in the state, dispatch an action to fetch it
 * and wait for a successful result.
 */
export function* ensureColonyIsInState(colonyENSName: ENSName): Saga<*> {
  /*
   * If the colony exists in the state, we're done here.
   */
  const colonyFromState = yield select(singleColonySelector, colonyENSName);
  if (colonyFromState) return;

  /*
   * Dispatch an action to fetch the given colony.
   */
  yield put<Action<typeof ACTIONS.COLONY_FETCH>>(fetchColony(colonyENSName));

  /*
   * Wait for the successful fetch result (the colony should now be in state).
   */
  yield raceError(
    ({ type, payload: { keyPath } }) =>
      type === ACTIONS.COLONY_FETCH_SUCCESS && keyPath[0] === colonyENSName,
    ({ type, payload: { keyPath } }) =>
      type === ACTIONS.COLONY_FETCH_ERROR && keyPath[0] === colonyENSName,
    new Error(`Colony "${colonyENSName}" could not be found`),
  );
}

/*
 * Create a tasks index store for a colony.
 */
export function* createTasksIndexStore(colonyENSName: ENSName): Saga<DocStore> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  // TODO: No access controller available yet
  return yield call([ddb, ddb.createStore], tasksIndexStoreBlueprint, {
    colonyENSName,
  });
}
