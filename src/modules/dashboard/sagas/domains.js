/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  getContext,
  put,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';

import type { Action, AddressOrENSName, ENSName } from '~types';

import { putError } from '~utils/saga/effects';

import { set, get, getAll } from '../../../lib/database/commands';
import { getColonyMethod } from '../../core/sagas/utils';

import { domainsIndexSelector } from '../selectors';
import { domainsIndexStoreBlueprint } from '../stores';
import {
  DOMAIN_CREATE,
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_CREATE_TX_ERROR,
  DOMAIN_CREATE_TX_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
} from '../actionTypes';
import { createDomain } from '../actionCreators';
import {
  ensureColonyIsInState,
  createDomainsIndexStore,
  getDomainsIndexStore,
} from './shared';

/*
 * Given a colony identifier and a parent domain ID (1 == root),
 * send a transaction to create a domain, and return the error or
 * success action for the transaction.
 */
function* createDomainTransaction(
  identifier: AddressOrENSName,
  parentDomainId: number = 1,
) {
  const action = yield call(createDomain, identifier, {
    parentDomainId,
  });
  yield put(action);

  return yield take(
    ({ type, payload }) =>
      [DOMAIN_CREATE_TX_ERROR, DOMAIN_CREATE_TX_SUCCESS].includes(type) &&
      payload.id === action.payload.id,
  );
}

/*
 * Given a colony ENS name, get or create the domains index store
 * (via the colony state).
 */
function* getOrCreateDomainsIndexStore(colonyENSName: ENSName) {
  const ddb = yield getContext('ddb');
  let store;

  /*
   * Select the `domainsIndex` database address for the given colony ENS name.
   */
  const domainsIndexAddress = yield select(domainsIndexSelector, colonyENSName);

  /*
   * Get the store if the `domainsIndex` address was found.
   */
  if (domainsIndexAddress) {
    // TODO no access controller is available yet
    store = yield call(
      [ddb, ddb.getStore],
      domainsIndexStoreBlueprint,
      domainsIndexAddress,
    );
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
  yield call([domainsIndexStore, domainsIndexStore.load]);
  const domain = yield call(get, domainsIndexStore, domainId.toString());

  /*
   * If not yet set, set the new domain on the domains index store.
   */
  if (!domain)
    yield call(set, domainsIndexStore, domainId.toString(), {
      domainName,
      tasksIndex: tasksIndexStore.address.toString(),
    });
}

function* createDomainSaga({
  payload: { colonyENSName, domainName, parentDomainId = 1 },
}: Action): Saga<void> {
  try {
    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Create the domain on the colony with a transaction.
     * TODO idempotency could be improved here by looking for a pending transaction.
     */
    const action = yield call(
      createDomainTransaction,
      colonyENSName,
      parentDomainId,
    );

    /*
     * If an error has already been `put`, simply exit.
     */
    if (action.type === DOMAIN_CREATE_ERROR) return;

    /*
     * Get the new domain ID from the successful transaction.
     */
    const { domainId } = action.payload.eventData;

    /*
     * Add an entry to `domainsIndex` on the colony store.
     */
    yield call(addDomainToIndex, colonyENSName, domainId, domainName);

    /*
     * Dispatch a success action with the newly-added domain.
     */
    const props = { domainId, domainName };
    yield put({
      type: DOMAIN_CREATE_SUCCESS,
      payload: { keyPath: [colonyENSName, domainId], props },
    });
  } catch (error) {
    yield putError(DOMAIN_CREATE_ERROR, error);
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
  payload: {
    keyPath: [colonyENSName, domainId],
    keyPath,
  },
}: Action): Saga<void> {
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
    const props = yield call(getAll, store);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: DOMAIN_FETCH_SUCCESS,
      payload: { keyPath, props },
    });
  } catch (error) {
    yield putError(DOMAIN_FETCH_ERROR, error, { keyPath });
  }
}

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_CREATE, createDomainSaga);
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
}
