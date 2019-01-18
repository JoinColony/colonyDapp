/* @flow */

import type { Saga } from 'redux-saga';

import { delay } from 'redux-saga';
import {
  call,
  getContext,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { replace, push } from 'connected-react-router';

import type { Action, ENSName, UniqueAction } from '~types';

import { putError, callCaller } from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/web3/ens';

import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';

import { getNetworkMethod } from '../../core/sagas/utils';
import { getAll } from '../../../lib/database/commands';

import { colonyStoreBlueprint } from '../stores';
import {
  ensureColonyIsInState,
  fetchColonyStore,
  getOrCreateDomainsIndexStore,
  getOrCreateDraftsIndexStore,
} from './shared';

import {
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_CREATE_LABEL,
  COLONY_CREATE,
  COLONY_DOMAIN_VALIDATE_ERROR,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_DOMAIN_VALIDATE,
  COLONY_FETCH_ERROR,
  COLONY_FETCH_SUCCESS,
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
  COLONY_ADMIN_ADD,
  COLONY_ADMIN_ADD_SUCCESS,
  COLONY_ADMIN_ADD_ERROR,
  COLONY_ADMIN_REMOVE,
  COLONY_ADMIN_REMOVE_SUCCESS,
  COLONY_ADMIN_REMOVE_ERROR,
  COLONY_ENS_NAME_FETCH,
  COLONY_ENS_NAME_FETCH_SUCCESS,
  COLONY_ENS_NAME_FETCH_ERROR,
} from '../actionTypes';

import {
  addColonyAdmin,
  removeColonyAdmin,
  createColony,
  createColonyLabel,
} from '../actionCreators';

function* getOrCreateColonyStore(colonyENSName: ENSName) {
  /*
   * Get and load the store, if it exists.
   */
  let store = yield call(fetchColonyStore, colonyENSName);
  if (store) yield call([store, store.load]);

  /*
   * Create the store if it doesn't already exist.
   */
  // TODO: No access controller available yet
  if (!store) {
    const ddb = yield getContext('ddb');
    store = yield call([ddb, ddb.createStore], colonyStoreBlueprint);
  }

  return store;
}

/*
 * Simply forward on the form params to create a transaction.
 */
function* createColonySaga({
  payload: params,
  meta,
}: UniqueAction): Saga<void> {
  yield put(
    createColony({
      meta,
      params,
    }),
  );
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
  meta,
}: UniqueAction): Saga<void> {
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
  };

  // Dispatch and action to set the current colony in the app state (simulating fetching it)
  yield put({
    type: COLONY_FETCH_SUCCESS,
    payload: { keyPath: [ensName], props: colonyStoreData },
  });

  /*
   * Get and/or create the index stores for this colony.
   */
  const domainsIndex = yield call(getOrCreateDomainsIndexStore, ensName);
  const draftsIndex = yield call(getOrCreateDraftsIndexStore, ensName);
  const databases = {
    domainsIndex: domainsIndex.address.toString(),
    draftsIndex: draftsIndex.address.toString(),
  };

  /*
   * Get or create a colony store and save the colony to that store.
   */
  const store = yield call(getOrCreateColonyStore, ensName);

  /*
   * Update the colony in the app state with the `domainsIndex` address.
   */
  const props = {
    ...colonyStoreData,
    databases,
  };
  yield put({
    type: COLONY_FETCH_SUCCESS,
    payload: {
      keyPath: [ensName],
      props,
    },
  });

  /*
   * Save the colony props to the colony store.
   */
  yield call([store, store.set], props);

  /*
   * Dispatch an action to create the given ENS name for the colony.
   */
  yield put(
    createColonyLabel({
      identifier: colonyAddress,
      params: {
        colonyName: ensName,
        orbitDBPath: store.address.toString(),
      },
      meta,
    }),
  );
}

function* validateColonyDomain({
  payload: { ensName },
  meta,
}: UniqueAction): Saga<void> {
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
      meta,
    );
    return;
  }
  yield put({ type: COLONY_DOMAIN_VALIDATE_SUCCESS, meta });
}

/*
 * Redirect to the colony home for the given (newly-registered) label
 */
// TODO: we have cases where we do something like that with the raceError effect (custom take)
function* createColonyLabelSuccessSaga({
  payload: {
    params: { colonyName },
  },
}: Action): Saga<void> {
  yield put(replace(`colony/${colonyName}`));
}

function* updateColonySaga({
  payload: { ensName, ...colonyUpdateValues },
  meta,
}: UniqueAction): Saga<void> {
  try {
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set the new values in the store
     */
    yield call([store, store.set], colonyUpdateValues);

    /*
     * Update the colony in the redux store to show the updated values
     */
    yield put({
      type: COLONY_PROFILE_UPDATE_SUCCESS,
      payload: { ensName, colonyUpdateValues },
      meta,
    });
  } catch (error) {
    yield putError(COLONY_PROFILE_UPDATE_ERROR, error, meta);
  }
}

function* fetchColonySaga({
  payload: {
    keyPath: [ensName],
    keyPath,
  },
}: Action): Saga<void> {
  try {
    const store = yield call(getOrCreateColonyStore, ensName);
    const props = yield call(getAll, store);
    yield put({
      type: COLONY_FETCH_SUCCESS,
      payload: { keyPath, props },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_ERROR, error, { keyPath });
  }
}

function* fetchColonyENSName({
  payload: { colonyAddress },
}: Action): Saga<void> {
  try {
    const { domain } = yield callCaller({
      context: NETWORK_CONTEXT,
      methodName: 'lookupRegisteredENSDomain',
      params: { ensAddress: colonyAddress },
    });
    if (!domain)
      throw new Error(
        `No Colony ENS name found for address "${colonyAddress}"`,
      );
    const [ensName, type] = domain.split('.');
    if (type !== 'colony')
      throw new Error(`Address "${colonyAddress}" is not a Colony`);

    yield put({
      type: COLONY_ENS_NAME_FETCH_SUCCESS,
      payload: { key: colonyAddress, ensName },
    });
  } catch (error) {
    yield putError(COLONY_ENS_NAME_FETCH_ERROR, error, { key: colonyAddress });
  }
}

function* uploadColonyAvatar({
  payload: { data, ensName },
  meta,
}: UniqueAction): Saga<void> {
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
      meta,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_UPLOAD_ERROR, error, meta);
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

function* removeColonyAvatar({
  payload: { ensName },
  meta,
}: UniqueAction): Saga<void> {
  try {
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
      meta,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_REMOVE_ERROR, error, meta);
  }
}

function* addColonyAdminSaga({
  payload: { newAdmin, ensName },
  meta,
}: UniqueAction): Saga<void> {
  try {
    const { walletAddress, username } = newAdmin.profile;
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    const colonyAddress = store.get('address');
    const colonyAdmins = store.get('admins');
    /*
     * Dispatch the action to the admin in th redux store
     */
    yield put({
      type: COLONY_ADMIN_ADD_SUCCESS,
      payload: {
        ensName,
        adminData: newAdmin.profile,
      },
    });
    /*
     * Set the new value on the colony's store
     */
    yield call([store, store.set], 'admins', {
      ...colonyAdmins,
      [username]: newAdmin.profile,
    });
    /*
     * Dispatch the action to set the admin on the contract level (transaction)
     */
    yield put(
      addColonyAdmin({
        identifier: colonyAddress,
        params: { user: walletAddress },
        meta,
      }),
    );
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_ADD_ERROR, error, meta);
  }
}

function* removeColonyAdminSaga({
  payload: { admin, ensName },
  meta,
}: UniqueAction): Saga<void> {
  try {
    const { walletAddress, username } = admin;

    /*
     * Ensure the colony is in the state.
     */
    yield call(ensureColonyIsInState, ensName);

    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);
    const colonyAddress = store.get('address');
    const colonyAdmins = store.get('admins');
    /*
     * Dispatch the action to the admin in th redux store
     */
    // TODO: This is optimistic but when there's an issue it will NOT be undone.
    // So if there's an error, the admin will still be reported as removed
    yield put({
      type: COLONY_ADMIN_REMOVE_SUCCESS,
      payload: {
        ensName,
        username,
      },
      meta,
    });
    /*
     * Remove the colony admin and set the new value on the colony's store
     */
    delete colonyAdmins[username];
    yield call([store, store.set], 'admins', colonyAdmins);
    /*
     * Dispatch the action to set the admin on the contract level (transaction)
     */
    yield put(
      removeColonyAdmin({
        identifier: colonyAddress,
        params: {
          user: walletAddress,
        },
        meta,
      }),
    );
    /*
     * Redirect the user back to the admins tab
     */
    yield put(
      push({
        state: { initialTab: 3 },
      }),
    );
  } catch (error) {
    yield putError(COLONY_ADMIN_REMOVE_ERROR, error, meta);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH, fetchColonySaga);
  yield takeEvery(COLONY_PROFILE_UPDATE, updateColonySaga);
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(COLONY_CREATE_LABEL, createColonyLabelSaga);
  yield takeEvery(COLONY_CREATE_LABEL_SUCCESS, createColonyLabelSuccessSaga);
  yield takeEvery(COLONY_AVATAR_FETCH, fetchColonyAvatar);
  yield takeEvery(COLONY_ENS_NAME_FETCH, fetchColonyENSName);
  yield takeEvery(COLONY_ADMIN_ADD, addColonyAdminSaga);
  yield takeEvery(COLONY_ADMIN_REMOVE, removeColonyAdminSaga);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
  yield takeLatest(COLONY_AVATAR_UPLOAD, uploadColonyAvatar);
  yield takeLatest(COLONY_AVATAR_REMOVE, removeColonyAvatar);
}
