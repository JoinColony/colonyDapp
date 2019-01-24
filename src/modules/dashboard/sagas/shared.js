/* @flow */
import type { Saga } from 'redux-saga';

import { call, getContext, select, put } from 'redux-saga/effects';

import type { ENSName } from '~types';
import type {
  DocStore,
  ValidatedKVStore,
  KVStore,
} from '../../../lib/database/stores';

import { getENSDomainString } from '~utils/web3/ens';
import { raceError } from '~utils/saga/effects';

import { DDB } from '../../../lib/database';
import { walletAddressSelector } from '../../users/selectors';
import {
  colonyStoreBlueprint,
  domainsIndexStoreBlueprint,
  tasksIndexStoreBlueprint,
} from '../stores';
import { COLONY_FETCH_ERROR, COLONY_FETCH_SUCCESS } from '../actionTypes';
import { fetchColony } from '../actionCreators';
import { domainsIndexSelector, singleColonySelector } from '../selectors';

// TODO
const tasksIndexSelector = () => null;

/*
 * Given a colony ENS name, fetch the colony store (if it exists).
 */
export function* fetchColonyStore(
  colonyENSName: ENSName,
): Saga<?ValidatedKVStore> {
  const ddb: DDB = yield getContext('ddb');
  const walletAddress = yield select(walletAddressSelector);

  /*
   * Get the ENS domain string for the given colony ENS name
   */
  const domainString = yield call(getENSDomainString, 'colony', colonyENSName);

  /*
   * Get the colony store, if it exists.
   */
  return yield call([ddb, ddb.getStore], colonyStoreBlueprint, domainString, {
    walletAddress,
  });
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
  yield put(fetchColony(colonyENSName));

  /*
   * Wait for the successful fetch result (the colony should now be in state).
   */
  yield raceError(
    ({ type, payload: { keyPath } }) =>
      type === COLONY_FETCH_SUCCESS && keyPath[0] === colonyENSName,
    ({ type, payload: { keyPath } }) =>
      type === COLONY_FETCH_ERROR && keyPath[0] === colonyENSName,
    new Error(`Colony "${colonyENSName}" could not be found`),
  );
}

/*
 * Get the domains index store for a given colony (if the store exists).
 */
export function* getDomainsIndexStore(colonyENSName: ENSName): Saga<?DocStore> {
  /*
   * Get the `domainsIndex` address for the given colony from the store.
   */
  const domainsIndexAddress = yield select(domainsIndexSelector, colonyENSName);

  /*
   * If the `domainsIndex` address wasn't found, exit.
   */
  if (!domainsIndexAddress) return null;

  /*
   * Get the store for the `domainsIndex` address.
   */
  const ddb = yield getContext('ddb');
  // TODO: No access controller available yet
  return yield call(
    [ddb, ddb.getStore],
    domainsIndexStoreBlueprint,
    domainsIndexAddress,
  );
}

/*
 * Create a domains index store for a colony.
 */
export function* createDomainsIndexStore(
  colonyENSName: ENSName,
): Saga<DocStore> {
  const ddb: DDB = yield getContext('ddb');

  // TODO: No access controller available yet
  return yield call([ddb, ddb.createStore], domainsIndexStoreBlueprint, {
    colonyENSName,
  });
}

/*
 * Get or create a domains index store for a colony.
 */
export function* getOrCreateDomainsIndexStore(
  colonyENSName: ENSName,
): Saga<DocStore> {
  /*
   * Get and load the store, if it exists.
   */
  let store: DocStore | null = yield call(getDomainsIndexStore, colonyENSName);
  if (store) yield call([store, store.load]);

  /*
   * Create the store if it doesn't already exist. Note: this does not add
   * a reference to the colony store.
   */
  if (!store) store = yield call(createDomainsIndexStore, colonyENSName);

  return store;
}

/*
 * Get the tasks index store for a given colony (if the store exists).
 */
export function* getTasksIndexStore(colonyENSName: ENSName): Saga<?DocStore> {
  /*
   * Get the `tasksIndex` address for the given colony from the store.
   */
  const tasksIndex = yield select(tasksIndexSelector, colonyENSName);

  /*
   * If the `tasksIndex` address wasn't found, exit.
   */
  if (!tasksIndex) return null;

  /*
   * Get the store for the `tasksIndex` address.
   */
  // TODO no access controller available yet
  const ddb = yield getContext('ddb');
  return yield call([ddb, ddb.getStore], tasksIndexStoreBlueprint, tasksIndex);
}

/*
 * Create a tasks index store for a colony.
 */
export function* createTasksIndexStore(colonyENSName: ENSName): Saga<DocStore> {
  const ddb: DDB = yield getContext('ddb');

  // TODO: No access controller available yet
  return yield call([ddb, ddb.createStore], tasksIndexStoreBlueprint, {
    colonyENSName,
  });
}

/*
 * Get or create a tasks index store for a colony.
 */
export function* getOrCreateTasksIndexStore(
  colonyENSName: ENSName,
): Saga<KVStore> {
  /*
   * Get and load the store, if it exists.
   */
  let store: KVStore | null = yield call(getTasksIndexStore, colonyENSName);
  if (store) yield call([store, store.load]);

  /*
   * Create the store if it doesn't already exist. Note: this does not add
   * a reference to the colony store.
   */
  if (!store) store = yield call(createTasksIndexStore, colonyENSName);

  return store;
}
