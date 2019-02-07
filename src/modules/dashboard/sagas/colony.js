/* @flow */

import type { Saga } from 'redux-saga';

import { call, delay, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import type {
  Action,
  ENSName,
  UniqueAction,
  UniqueActionWithKeyPath,
} from '~types';

import { putError, callCaller } from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/web3/ens';
import { CONTEXT, getContext } from '~context';

import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';

import { getNetworkMethod } from '../../core/sagas/utils';
import { set, getAll } from '../../../lib/database/commands';

import { createBatchTxRunner } from '../../core/sagas/transactions';

import { colonyStoreBlueprint } from '../stores';

import {
  COLONY_AVATAR_FETCH,
  COLONY_AVATAR_FETCH_ERROR,
  COLONY_AVATAR_FETCH_SUCCESS,
  COLONY_AVATAR_REMOVE,
  COLONY_AVATAR_REMOVE_ERROR,
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_AVATAR_UPLOAD,
  COLONY_AVATAR_UPLOAD_ERROR,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_CREATE,
  COLONY_CREATE_ERROR,
  COLONY_CREATE_SUCCESS,
  COLONY_CREATE_LABEL,
  COLONY_CREATE_LABEL_SUCCESS,
  COLONY_DOMAIN_VALIDATE,
  COLONY_DOMAIN_VALIDATE_ERROR,
  COLONY_DOMAIN_VALIDATE_SUCCESS,
  COLONY_ENS_NAME_FETCH,
  COLONY_ENS_NAME_FETCH_ERROR,
  COLONY_ENS_NAME_FETCH_SUCCESS,
  COLONY_FETCH,
  COLONY_FETCH_ERROR,
  COLONY_FETCH_SUCCESS,
  COLONY_PROFILE_UPDATE,
  COLONY_PROFILE_UPDATE_ERROR,
  COLONY_PROFILE_UPDATE_SUCCESS,
} from '../actionTypes';

import {
  createColony,
  createColonyLabel,
  createToken,
} from '../actionCreators';

import { fetchColonyStore, getOrCreateDomainsIndexStore } from './shared';

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
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    store = yield call([ddb, ddb.createStore], colonyStoreBlueprint);
  }

  return store;
}

const createColonyBatch = createBatchTxRunner({
  meta: { key: 'transaction.batch.createColony' },
  transactions: [
    {
      actionCreator: createToken,
    },
    {
      actionCreator: createColony,
      // We get all previous transactions as an array
      // Return value will be merged as params into the next tx
      transferParams: ([{ receipt }]) => ({
        tokenAddress: receipt && receipt.contractAddress,
      }),
    },
    {
      actionCreator: createColonyLabel,
      // We need the colony identifier from the second transaciton output
      transferIdentifier: ([
        ,
        // , ignores the first tx
        { eventData },
      ]) => eventData && eventData.colonyAddress,
    },
  ],
});

// TODO: Rename, complete and wire up after new onboarding is in place
function* createColonySagaNew(action: UniqueAction): Saga<void> {
  // Step 1: Create colony orbit-db database store, save the address -> orbitDBPath
  const orbitDBPath = 'temp';

  const {
    meta,
    payload: { tokenName, tokenSymbol, colonyName },
  } = action;
  try {
    // Step 2: Run colony creation batch
    // Once done, we get all succeeded transactions in a handy array
    const transactions = yield call(createColonyBatch, action, [
      { params: { name: tokenName, symbol: tokenSymbol } },
      null,
      {
        params: { colonyName, orbitDBPath },
      },
    ]);
    // Step 3: Do something with the transaction data (maybe add it to the orbit-db store)
    // TODO: Do store stuff here
    console.info(transactions);

    // Step 4: report success for the colony creation wizard
    yield put({
      type: COLONY_CREATE_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(COLONY_CREATE_ERROR, error, meta);
  }
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
      // TODO: this has to be removed once the new onboarding is properly wired to the gasStation
      options: {
        gasLimit: 5000000,
      },
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
  const fetchSuccessAction = {
    type: COLONY_FETCH_SUCCESS,
    meta: { ...meta, keyPath: [ensName] },
    payload: colonyStoreData,
  };
  yield put(fetchSuccessAction);

  /*
   * Get and/or create the index stores for this colony.
   */
  const domainsIndex = yield call(getOrCreateDomainsIndexStore, ensName);
  const databases = {
    domainsIndex: domainsIndex.address.toString(),
  };

  /*
   * Get or create a colony store and save the colony to that store.
   */
  const store = yield call(getOrCreateColonyStore, ensName);

  /*
   * Update the colony in the app state with the `domainsIndex` address.
   */
  const completeColonyStoreData = {
    ...colonyStoreData,
    databases,
  };
  yield put({ ...fetchSuccessAction, payload: completeColonyStoreData });

  /*
   * Save the colony props to the colony store.
   */
  yield call(set, store, completeColonyStoreData);

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
      // TODO: this has to be removed once the new onboarding is properly wired to the gasStation
      options: {
        gasLimit: 500000,
      },
    }),
  );
}

function* validateColonyDomain({
  payload: { ensName },
  meta,
}: UniqueAction): Saga<void> {
  yield delay(300);

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
  meta: {
    keyPath: [ensName],
  },
  meta,
  payload: colonyUpdateValues,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set the new values in the store
     */
    yield call(set, store, colonyUpdateValues);

    /*
     * Update the colony in the redux store to show the updated values
     */
    yield put({
      type: COLONY_PROFILE_UPDATE_SUCCESS,
      meta,
      payload: colonyUpdateValues,
    });
  } catch (error) {
    yield putError(COLONY_PROFILE_UPDATE_ERROR, error, meta);
  }
}

function* fetchColonySaga({
  meta: {
    keyPath: [ensName],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const store = yield call(getOrCreateColonyStore, ensName);
    const payload = yield call(getAll, store);
    yield put({
      type: COLONY_FETCH_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(COLONY_FETCH_ERROR, error, meta);
  }
}

function* fetchColonyENSName({
  meta: {
    keyPath: [colonyAddress],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
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
      meta,
      payload: ensName,
    });
  } catch (error) {
    yield putError(COLONY_ENS_NAME_FETCH_ERROR, error, meta);
  }
}

function* uploadColonyAvatar({
  meta: {
    keyPath: [ensName],
  },
  meta,
  payload: data,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    // first attempt upload to IPFS
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
    const hash = yield call([ipfsNode, ipfsNode.addString], data);

    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set the avatar's hash in the store
     */
    yield call(set, store, 'avatar', hash);

    /*
     * Store the new avatar hash value in the redux store so we can show it
     */
    yield put({
      type: COLONY_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: hash,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_UPLOAD_ERROR, error, meta);
  }
}

function* fetchColonyAvatar({
  meta,
  meta: {
    keyPath: [hash],
  },
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    /*
     * Get the base64 avatar image from ipfs
     */
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
    const avatarData = yield call([ipfsNode, ipfsNode.getString], hash);
    /*
     * Put the base64 value in the redux state so we can show it
     */
    yield put({
      type: COLONY_AVATAR_FETCH_SUCCESS,
      meta,
      payload: avatarData,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_FETCH_ERROR, error, meta);
  }
}

function* removeColonyAvatar({
  meta,
  meta: {
    keyPath: [ensName],
  },
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    /*
     * Get the colony store
     */
    const store = yield call(fetchColonyStore, ensName);

    /*
     * Set avatar to undefined
     */
    yield call(set, store, 'avatar', undefined);

    /*
     * Also set the avatar in the state to undefined (via a reducer)
     */
    yield put({
      type: COLONY_AVATAR_REMOVE_SUCCESS,
      meta,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_REMOVE_ERROR, error, meta);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_AVATAR_FETCH, fetchColonyAvatar);
  // TODO: rename properly once the new onboarding is done
  yield takeEvery('COLONY_CREATE_NEW', createColonySagaNew);
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(COLONY_CREATE_LABEL, createColonyLabelSaga);
  yield takeEvery(COLONY_CREATE_LABEL_SUCCESS, createColonyLabelSuccessSaga);
  yield takeEvery(COLONY_ENS_NAME_FETCH, fetchColonyENSName);
  yield takeEvery(COLONY_FETCH, fetchColonySaga);
  yield takeEvery(COLONY_PROFILE_UPDATE, updateColonySaga);

  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(COLONY_AVATAR_REMOVE, removeColonyAvatar);
  yield takeLatest(COLONY_AVATAR_UPLOAD, uploadColonyAvatar);
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
}
