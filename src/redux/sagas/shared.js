/* @flow */
import type { Saga } from 'redux-saga';

import { call, select, put } from 'redux-saga/effects';

import type { ENSName } from '~types';
import type {
  DocStore,
  FeedStore,
  ValidatedKVStore,
} from '../../lib/database/stores';

import { getENSDomainString } from '~utils/web3/ens';
import { raceError } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import {
  walletAddressSelector,
  domainsIndexSelector,
  singleColonySelector,
} from '../selectors';
import {
  colonyStoreBlueprint,
  domainsIndexStoreBlueprint,
  tasksIndexStoreBlueprint,
  commentsBlueprint,
} from '../stores';
import { fetchColony } from '../actionCreators';

/*
 * Given a colony ENS name, fetch the colony store (if it exists).
 */
export function* fetchColonyStore(
  colonyENSName: ENSName,
): Saga<?ValidatedKVStore> {
  let store;
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const walletAddress = yield select(walletAddressSelector);

  /*
   * Get the ENS domain string for the given colony ENS name
   */
  const domainString = yield call(getENSDomainString, 'colony', colonyENSName);

  /*
   * Get the colony store, if it exists.
   */
  const colonyStoreExists = yield call([ddb, ddb.storeExists], domainString);
  if (colonyStoreExists) {
    store = yield call(
      [ddb, ddb.getStore],
      colonyStoreBlueprint,
      domainString,
      {
        walletAddress,
      },
    );
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
  yield put(fetchColony(colonyENSName));

  /*
   * Wait for the successful fetch result (the colony should now be in state).
   */
  yield raceError(
    ({ type, meta: { keyPath } }) =>
      type === ACTIONS.COLONY_FETCH_SUCCESS && keyPath[0] === colonyENSName,
    ({ type, meta: { keyPath } }) =>
      type === ACTIONS.COLONY_FETCH_ERROR && keyPath[0] === colonyENSName,
    new Error(`Colony "${colonyENSName}" could not be found`),
  );
}

/*
 * Get the domains index store for a given colony (if the store exists).
 */
export function* getDomainsIndexStore(colonyENSName: ENSName): Saga<?DocStore> {
  let store;
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
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  const domainsIndexStoreExists = yield call(
    [ddb, ddb.storeExists],
    domainsIndexAddress,
  );
  if (domainsIndexStoreExists) {
    // TODO: No access controller available yet
    store = yield call(
      [ddb, ddb.getStore],
      domainsIndexStoreBlueprint,
      domainsIndexAddress,
    );
  }
  return store;
}

/*
 * Create a domains index store for a colony.
 */
export function* createDomainsIndexStore(
  colonyENSName: ENSName,
): Saga<DocStore> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

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
 * Create a tasks index store for a colony.
 */
export function* createTasksIndexStore(colonyENSName: ENSName): Saga<DocStore> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  // TODO: No access controller available yet
  return yield call([ddb, ddb.createStore], tasksIndexStoreBlueprint, {
    colonyENSName,
  });
}

/*
 * Create the comments store for a given task.
 */
export function* createCommentsStore(taskId: string): Saga<FeedStore> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  return yield call([ddb, ddb.createStore], commentsBlueprint, {
    taskId,
  });
}

/*
 * Get the comments store for a given task (if the store exists).
 * TODO replace this function after https://github.com/JoinColony/colonyDapp/pull/815
 */
// eslint-disable-next-line no-unused-vars
export function* getCommentsStore(taskId: string): Saga<?FeedStore> {
  let store;
  /*
   * Get the comments store address from Redux
   */
  const commentsStoreAddress = null;

  /*
   * If the comments store doesn't exist, return null
   */
  if (!commentsStoreAddress) {
    return null;
  }

  /*
   * Get the comments store for the returned address
   */
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);

  const commentsStoreExists = yield call(
    [ddb, ddb.storeExists],
    commentsStoreAddress,
  );
  if (commentsStoreExists) {
    // TODO no access controller available yet
    store = yield call(
      [ddb, ddb.getStore],
      commentsBlueprint,
      commentsStoreAddress,
    );
  }
  return store;
}

/*
 * Get or create a comments tore
 */
export function* getOrCreateCommentsStore(taskId: string): Saga<FeedStore> {
  /*
   * Get and load the store, if it exists.
   */
  let commentsStoreAddress: FeedStore | null = yield call(
    getCommentsStore,
    taskId,
  );
  if (commentsStoreAddress) {
    yield call([commentsStoreAddress, commentsStoreAddress.load]);
  }
  /*
   * Create the store if it doesn't already exist.
   */
  if (!commentsStoreAddress) {
    commentsStoreAddress = yield call(createCommentsStore, taskId);
  }

  return commentsStoreAddress;
}
