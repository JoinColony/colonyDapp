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
} from '../actionTypes';

import { createColony, createColonyLabel } from '../actionCreators';

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

  const colonyStoreData = {
    meta: {
      id: colonyId,
      address: colonyAddress,
      ensName,
    },
    name: colonyName,
    token: {
      address: tokenAddress,
      icon: tokenIcon,
      name: tokenName,
      symbol: tokenSymbol,
    },
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

function* fetchColonySaga({ payload: { ensName } }: Action): Saga<void> {
  try {
    const store = yield call(fetchColonyStore, ensName);

    // TODO there's a delay here because (in local testing) it seems as if
    // all keys are not available immediately, despite the store being loaded.
    yield call(delay, 5000);

    const colonyStoreData = yield call([store, store.all]);

    yield put({
      type: COLONY_FETCH_SUCCESS,
      payload: { colonyStoreData },
    });
  } catch (error) {
    yield putError(COLONY_FETCH_ERROR, error);
  }
}

export default function* colonySagas(): any {
  yield takeEvery(COLONY_FETCH, fetchColonySaga);
  yield takeEvery(COLONY_CREATE, createColonySaga);
  yield takeEvery(COLONY_CREATE_LABEL, createColonyLabelSaga);
  yield takeEvery(COLONY_CREATE_LABEL_SUCCESS, createColonyLabelSuccessSaga);
  // Note that this is `takeLatest` because it runs on user keyboard input
  // and uses the `delay` saga helper.
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
}
