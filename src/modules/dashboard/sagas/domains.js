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

import { walletAddressSelector } from '../../users/selectors';
import { domainsIndexSelector } from '../selectors';
import { set } from '../../../lib/database/commands';

import { domainsIndexStoreBlueprint } from '../stores';
import {
  DOMAIN_CREATE,
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
} from '../actionTypes';
import { createDomain } from '../actionCreators';

/*
 * Given a colony identifier and a parent domain ID (1 == root),
 * send a transaction to create a domain, and return the error or
 * success action for the transaction.
 */
function* createDomainTransaction(
  identifier: AddressOrENSName,
  parentDomainId: number = 1,
) {
  yield put(createDomain(identifier, { parentDomainId }));

  return yield take(
    ({ type, payload }) =>
      [DOMAIN_CREATE_ERROR, DOMAIN_CREATE_SUCCESS].includes(type) &&
      payload.params.parentDomainId === parentDomainId &&
      payload.identifier === identifier,
  );
}

/*
 * Given a colony ENS name, fetch the domains index store (via
 * the colony state).
 */
function* fetchDomainsIndexStore(colonyENSName: ENSName) {
  const ddb = yield getContext('ddb');

  const walletAddress = yield select(walletAddressSelector);

  /*
   * Select the `domainsIndex` database address for the given colony ENS name.
   * If that colony doesn't exist in the state, this will fail.
   */
  const domainsIndex = yield select(domainsIndexSelector, colonyENSName);

  /*
   * Return the domains index store.
   */
  return yield call(
    [ddb, ddb.getStore],
    domainsIndexStoreBlueprint,
    domainsIndex,
    {
      walletAddress,
    },
  );
}

/*
 * Given a colony ENS name and a newly-created domain ID on that colony,
 * create a tasks index store for that domain ID.
 */
// TODO make idempotent
// eslint-disable-next-line no-unused-vars
function* createTasksIndexStore(colonyENSName: ENSName, domainId: number) {
  // TODO actually create a store
  return yield {
    address: {
      toString() {
        return 'TODO replace me';
      },
    },
  };
}

// TODO make idempotent
function* addDomainToIndex(
  colonyENSName: ENSName,
  domainId: number,
  domainName: string,
) {
  /*
   * Create a `TasksIndexDatabase` store for the domain.
   */
  const tasksIndexStore = yield call(
    createTasksIndexStore,
    colonyENSName,
    domainId,
  );

  /*
   * Get the domains index store.
   */
  const domainsIndexStore = yield call(fetchDomainsIndexStore, colonyENSName);

  /*
   * Set the new domain on the domains index store.
   */
  yield call(set, domainsIndexStore, domainId, {
    domainName,
    tasksIndex: tasksIndexStore.address.toString(),
  });
}

function* createDomainSaga({
  payload: { colonyENSName, domainName, parentDomainId = 1 },
}: Action): Saga<void> {
  try {
    /*
     * Create the domain on the colony with a transaction.
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
     * We're done here.
     */
    yield put({
      type: DOMAIN_CREATE_SUCCESS,
      payload: { colonyENSName, domainId },
    });
  } catch (error) {
    yield putError(DOMAIN_CREATE_ERROR, error);
  }
}

// function* fetchDomainSaga({
//   payload: { domainAddress, colonyENSName },
// }: Action): Saga<void> {
//   try {
//     const store = yield call(fetchOrCreateDomainStore, { domainAddress });
//     const domainStoreData = yield call(getAll, store);
//     yield put({
//       type: DOMAIN_FETCH_SUCCESS,
//       payload: { colonyENSName, domainStoreData, id: store.address.toString() },
//     });
//   } catch (error) {
//     yield putError(DOMAIN_FETCH_ERROR, error);
//   }
// }

export default function* domainSagas(): any {
  yield takeEvery(DOMAIN_CREATE, createDomainSaga);
  // yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);
}
