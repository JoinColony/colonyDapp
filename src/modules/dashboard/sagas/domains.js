/* @flow */

import type { Saga } from 'redux-saga';

import { call, fork, put, select, takeEvery } from 'redux-saga/effects';

import type { ENSName } from '~types';

import { putError, takeFrom } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { set, get, getAll } from '../../../lib/database/commands';
import { getColonyMethod } from '../../core/sagas/utils';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { COLONY_CONTEXT } from '../../core/constants';

import { domainsIndexSelector } from '../selectors';
import { domainsIndexStoreBlueprint } from '../stores';
import {
  ensureColonyIsInState,
  createDomainsIndexStore,
  getDomainsIndexStore,
} from './shared';
import type { Action } from '~redux';

/*
 * Given a colony ENS name, get or create the domains index store
 * (via the colony state).
 */
function* getOrCreateDomainsIndexStore(colonyENSName: ENSName) {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  let store;

  /*
   * Select the `domainsIndex` database address for the given colony ENS name.
   */
  const domainsIndexAddress = yield select(domainsIndexSelector, colonyENSName);

  /*
   * Get the store if the `domainsIndex` address was found.
   */
  if (domainsIndexAddress) {
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
    if (store) {
      /*
       * Load the store if it was found (it may have been cached).
       */
      yield call([store, store.load]);
    } else {
      // If `domainsIndex` is set, but the store wasn't found there, we can
      // only exit with an error.
      throw new Error('Domains index store not found');
    }
  } else {
    /*
     * If `domainsIndex` wasn't set on the colony, create the store.
     */
    store = yield call(createDomainsIndexStore, colonyENSName);
  }

  return store;
}

/*
 * Given a colony ENS name and a newly-created domain ID on that colony,
 * get or create the tasks index store for that domain ID.
 */
// eslint-disable-next-line no-unused-vars
function* getOrCreateTasksIndexStore(colonyENSName: ENSName, domainId: number) {
  // TODO actually get or create a store (when the store is defined)
  return yield {
    address: {
      toString() {
        return 'TODO replace me';
      },
    },
  };
}

function* addDomainToIndex(
  colonyENSName: ENSName,
  domainId: number,
  domainName: string,
): Saga<void> {
  /*
   * Get or create the `TasksIndexDatabase` store for the given colony/domain.
   */
  const tasksIndexStore = yield call(
    getOrCreateTasksIndexStore,
    colonyENSName,
    domainId,
  );
  /*
   * Get the domains index store for the given colony.
   */
  const domainsIndexStore = yield call(getDomainsIndexStore, colonyENSName);

  /*
   * Get the domain from the loaded domains index store.
   */
  const domain = yield call(get, domainsIndexStore, domainId.toString());
  /*
   * If not yet set, set the new domain on the domains index store.
   */
  if (!domain)
    yield call(set, domainsIndexStore, domainId.toString(), {
      name: domainName,
      tasksIndex: tasksIndexStore.address.toString(),
    });
}

function* createDomain({
  payload: { domainName, parentDomainId = 1 },
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.DOMAIN_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Create the domain on the colony with a transaction.
     * TODO idempotency could be improved here by looking for a pending transaction.
     */
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'addDomain',
      identifier: colonyENSName,
      params: { parentDomainId },
    });

    /*
     * Get the new domain ID from the successful transaction.
     */
    const {
      payload: {
        eventData: { domainId },
      },
    } = yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Add an entry to `domainsIndex` on the colony store.
     */
    yield call(addDomainToIndex, colonyENSName, domainId, domainName);
    /*
     * Dispatch a success action with the newly-added domain.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_CREATE_SUCCESS>>({
      type: ACTIONS.DOMAIN_CREATE_SUCCESS,
      meta: {
        ...meta,
        keyPath: [colonyENSName, domainId],
      },
      payload: { id: domainId, name: domainName },
    });
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* checkDomainExists(
  colonyENSName: ENSName,
  domainId: number,
): Saga<void> {
  const getDomainCount = yield call(
    getColonyMethod,
    'getDomainCount',
    colonyENSName,
  );
  const { count } = yield call(getDomainCount);

  if (domainId > count)
    throw new Error(
      `Domain ID "${domainId}" does not exist on colony "${colonyENSName}"`,
    );
}

/*
 * Fetch the domain for the given colony ENS name and domain ID.
 */
function* fetchDomainSaga({
  meta: {
    keyPath: [colonyENSName, domainId],
  },
  meta,
}: Action<typeof ACTIONS.DOMAIN_FETCH>): Saga<void> {
  try {
    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Check that the domain exists on the colony.
     */
    yield call(checkDomainExists, colonyENSName, domainId);

    /*
     * Get or create the domains index store for this colony.
     */
    const store = yield call(getOrCreateDomainsIndexStore, colonyENSName);

    /*
     * Get the domain props from the loaded store.
     */
    const payload = yield call(getAll, store);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.DOMAIN_FETCH_SUCCESS>>({
      type: ACTIONS.DOMAIN_FETCH_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.DOMAIN_FETCH_ERROR, error, meta);
  }
}

function* fetchColonyDomainsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: Action<typeof ACTIONS.COLONY_DOMAINS_FETCH>): Saga<void> {
  try {
    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get or create the domains index store for this colony.
     */
    const store = yield call(getOrCreateDomainsIndexStore, colonyENSName);

    /*
     * Get the domains from the loaded store.
     */
    const payload = yield call([store, store.getAll]);

    /*
     * Dispatch the success action.
     */
    yield put<Action<typeof ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_DOMAINS_FETCH_ERROR, error, meta);
  }
}

export default function* domainSagas(): any {
  yield takeEvery(ACTIONS.COLONY_DOMAINS_FETCH, fetchColonyDomainsSaga);
  yield takeEvery(ACTIONS.DOMAIN_CREATE, createDomain);
  yield takeEvery(ACTIONS.DOMAIN_FETCH, fetchDomainSaga);
}
