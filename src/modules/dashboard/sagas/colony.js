/* @flow */

import type { Saga } from 'redux-saga';

import { delay } from 'redux-saga';
import {
  call,
  getContext,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import type { Action, ENSName } from '~types';

import { putError } from '~utils/saga/effects';
import { getHashedENSDomainString, getENSDomainString } from '~utils/ens';

import { walletAddressSelector } from '../../users/selectors';

import { DDB } from '../../../lib/database';
import { getNetworkMethod } from '../../core/sagas/utils';

import { colonyStore } from '../stores';
import { fetchOrCreateDomainStore } from './domains';

import {
  COLONY_CREATE,
  COLONY_CREATE_LABEL,
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_DOMAIN_VALIDATE,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_DOMAIN_VALIDATE_ERROR,
  COLONY_FETCH_SUCCESS,
  COLONY_FETCH_ERROR,
  COLONY_FETCH,
  COLONY_PROFILE_UPDATE,
  COLONY_PROFILE_UPDATE_SUCCESS,
  COLONY_PROFILE_UPDATE_ERROR,
  COLONY_AVATAR_UPLOAD,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_AVATAR_UPLOAD_ERROR,
  COLONY_AVATAR_FETCH,
  COLONY_AVATAR_FETCH_SUCCESS,
  COLONY_AVATAR_FETCH_ERROR,
  COLONY_AVATAR_REMOVE,
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_AVATAR_REMOVE_ERROR,
} from '../actionTypes';

import { createColony, createColonyLabel } from '../actionCreators';
import { getAll } from '../../../lib/database/commands';

/*
 * Simply forward on the form params to create a transaction.
 */
function* createColonySaga({ payload: params }: *): Saga<void> {
  yield put(createColony(params));
}

function* createColonyLabelSaga({
  payload: {
    colonyId,
    colonyAddress,
    colonyName,
    ensName,
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenIcon,
  },
}: Action): Saga<void> {
  const ddb: DDB = yield getContext('ddb');

  // Create a colony store and save the colony to that store.
  // TODO: No access controller available yet
  const store = yield call([ddb, ddb.createStore], colonyStore);
  const rootDomainStore = yield call(fetchOrCreateDomainStore, {});

  const colonyStoreData = {
    address: colonyAddress,
    ensName,
    id: colonyId,
    name: colonyName,
    token: {
      address: tokenAddress,
      icon: tokenIcon,
      name: tokenName,
      symbol: tokenSymbol,
    },
    rootDomain: rootDomainStore.address.toString(),
  };

  // Dispatch and action to set the current colony in the app state (simulating fetching it)
  yield put({ type: COLONY_FETCH_SUCCESS, payload: { colonyStoreData } });

  yield call([store, store.set], colonyStoreData);

  // Dispatch an action to create the given ENS name for the colony.
  const action = yield call(createColonyLabel, colonyAddress, {
    colonyName: ensName,
    orbitDBPath: store.address.toString(),
  });
  yield put(action);
}

function* validateColonyDomain(action: Action): Saga<void> {
  const { ensName } = action.payload;
  yield call(delay, 300);

  const nameHash = yield call(getHashedENSDomainString, ensName, 'colony');

  const getAddressForENSHash = yield call(
    getNetworkMethod,
    'getAddressForENSHash',
  );
  const { ensAddress } = yield call(
    [getAddressForENSHash, getAddressForENSHash.call],
    { nameHash },
  );

  if (ensAddress) {
    yield putError(
      COLONY_DOMAIN_VALIDATE_ERROR,
      new Error('ENS address already exists'),
    );
    return;
  }
  yield put({ type: COLONY_DOMAIN_VALIDATE_SUCCESS });
}

/*
 * Redirect to the colony home for the given (newly-registered) label
 */
function* createColonyLabelSuccessSaga({
  payload: {
    params: { colonyName },
  },
}: Action): Saga<void> {
  yield put(replace(`colony/${colonyName}`));
}

function* fetchColonyStore(ensName: ENSName) {
  const ddb: DDB = yield getContext('ddb');
  const walletAddress = yield select(walletAddressSelector);

  const domainString = yield call(getENSDomainString, 'colony', ensName);
  const store = yield call([ddb, ddb.getStore], colonyStore, domainString, {
    walletAddress,
  });

  if (!store) throw new Error(`Unable to load store for "${domainString}"`);

  yield call([store, store.load]);

  return store;
}

function* updateColonySaga(action: Action): Saga<void> {
  try {
    const {
      payload: { ensName, ...colonyUpdateValues },
    } = action;
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set the new values in the store
     */
    yield call([store, store.set], colonyUpdateValues);
    /*
     * Fetch the newly set colony profile (from the store)
     */
    const colonyProfile = yield call(getAll, store);

    /*
     * Store the new profile in the redux store so we can show it
     */
    yield put({
      type: COLONY_PROFILE_UPDATE_SUCCESS,
      payload: { [ensName]: colonyProfile },
    });
  } catch (error) {
    yield putError(COLONY_PROFILE_UPDATE_ERROR, error);
  }
}

function* fetchColonySaga({ payload: { ensName } }: Action): Saga<void> {
  try {
    const store = yield call(fetchColonyStore, ensName);

    const colonyStoreData = yield call(getAll, store);

    yield put({
      type: COLONY_FETCH_SUCCESS,
      payload: { colonyStoreData },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_ERROR, error);
  }
}

function* uploadColonyAvatar(action: Action): Saga<void> {
  const { data, ensName } = action.payload;

  const ipfsNode = yield getContext('ipfsNode');

  try {
    // first attempt upload to IPFS
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    /*
     * Set the avatar's hash in the store
     */
    yield call([store, store.set], 'avatar', hash);

    /*
     * Store the new avatar hash value in the redux store so we can show it
     */
    yield put({
      type: COLONY_AVATAR_UPLOAD_SUCCESS,
      payload: { hash, ensName },
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_UPLOAD_ERROR, error);
  }
}

function* fetchColonyAvatar(action: Action): Saga<void> {
  const { hash } = action.payload;
  const ipfsNode = yield getContext('ipfsNode');

  try {
    /*
     * Get the base64 avatar image from ipfs
     */
    const avatarData = yield call([ipfsNode, ipfsNode.getString], hash);
    /*
     * Put the base64 value in the redux state so we can show it
     */
    yield put({
      type: COLONY_AVATAR_FETCH_SUCCESS,
      payload: { hash, avatarData },
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_FETCH_ERROR, error);
  }
}

function* removeColonyAvatar(action: Action): Saga<void> {
  try {
    const {
      payload: { ensName },
    } = action;
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set avatar to undefined
     */
    yield call([store, store.set], 'avatar', undefined);

    /*
     * Also set the avatar in the state to undefined (via a reducer)
     */
    yield put({
      type: COLONY_AVATAR_REMOVE_SUCCESS,
      payload: { ensName },
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_REMOVE_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH, fetchColonySaga);
  yield takeEvery(COLONY_PROFILE_UPDATE, updateColonySaga);
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(COLONY_CREATE_LABEL, createColonyLabelSaga);
  yield takeEvery(COLONY_CREATE_LABEL_SUCCESS, createColonyLabelSuccessSaga);
  yield takeEvery(COLONY_AVATAR_FETCH, fetchColonyAvatar);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
  yield takeLatest(COLONY_AVATAR_UPLOAD, uploadColonyAvatar);
  yield takeLatest(COLONY_AVATAR_REMOVE, removeColonyAvatar);
}
