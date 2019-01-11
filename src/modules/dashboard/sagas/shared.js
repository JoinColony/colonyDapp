/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Saga } from 'redux-saga';

import { call, getContext, select, put } from 'redux-saga/effects';

import type { Address, ENSName } from '~types';
import type { DocStore, ValidatedKVStore } from '../../../lib/database/stores';

import { getENSDomainString } from '~utils/ens';
import { raceError } from '~utils/saga/effects';

import { DDB } from '../../../lib/database';
import { colonyStoreBlueprint, domainsIndexStoreBlueprint } from '../stores';
import { COLONY_FETCH_ERROR, COLONY_FETCH_SUCCESS } from '../actionTypes';
import { fetchColony } from '../actionCreators';
import {
  colonyAddressSelector,
  domainsIndexSelector,
  singleColonySelector,
} from '../selectors';

export function* getColonyAccessControllerProps(
  colonyENSName: ENSName,
): Saga<{|
  colonyAddress: Address,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
|}> {
  /*
   * Get the address for the given colony.
   */
  const colonyAddress = yield select(colonyAddressSelector, colonyENSName);

  /*
   * Get the current wallet.
   */
  const wallet = yield getContext('wallet');

  /*
   * Get the colony client for this colony.
   */
  const colonyManager = yield getContext('colonyManager');
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyAddress,
  );

  /*
   * Return the required props for `ColonyAccessController`.
   */
  return { colonyAddress, wallet, colonyClient };
}

/*
 * Given a colony ENS name, fetch the colony store (if it exists).
 */
export function* fetchColonyStore(
  colonyENSName: ENSName,
): Saga<?ValidatedKVStore> {
  const ddb: DDB = yield getContext('ddb');

  /*
   * Get the ENS domain string for the given colony ENS name
   */
  const domainString = yield call(getENSDomainString, 'colony', colonyENSName);

  /*
   * Get the props for the store (for now, just for the access controller).
   */
  const storeProps = yield call(getColonyAccessControllerProps, colonyENSName);

  /*
   * Get the colony store, if it exists.
   */
  return yield call(
    [ddb, ddb.getStore],
    colonyStoreBlueprint,
    domainString,
    storeProps,
  );
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
   * Get the store props (for now, just those for the access controller).
   */
  const storeProps = yield call(getColonyAccessControllerProps, colonyENSName);

  /*
   * Get the store for the `domainsIndex` address.
   */
  const ddb = yield getContext('ddb');
  return yield call(
    [ddb, ddb.getStore],
    domainsIndexStoreBlueprint,
    domainsIndexAddress,
    storeProps,
  );
}

/*
 * Create a domains index store for a colony.
 */
export function* createDomainsIndexStore(
  colonyENSName: ENSName,
): Saga<DocStore> {
  /*
   * Get the store props (for now, just those for the access controller).
   */
  const storeProps = yield call(getColonyAccessControllerProps, colonyENSName);

  /*
   * Create the domains index store.
   */
  const ddb: DDB = yield getContext('ddb');
  return yield call(
    [ddb, ddb.createStore],
    domainsIndexStoreBlueprint,
    storeProps,
  );
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
