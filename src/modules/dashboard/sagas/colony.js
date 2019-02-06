/* @flow */

import type { Saga } from 'redux-saga';

import {
  call,
  delay,
  put,
  take,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import type {
  AddressOrENSName,
  Action,
  ENSName,
  UniqueAction,
  UniqueActionWithKeyPath,
} from '~types';

import {
  putError,
  callCaller,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { getHashedENSDomainString } from '~utils/web3/ens';
import { CONTEXT, getContext } from '~context';

import {
  createColonyProfile,
  updateColonyProfile,
  setColonyAvatar,
  createDomain,
  removeColonyAvatar,
} from '../../../data/service/commands';

import {
  getColony,
  // getColonyAvatar,
  getColonyDomains,
} from '../../../data/service/queries';
import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';

import { createBatchTxRunner } from '../../core/sagas/transactions';
import { getColonyMethod, getNetworkMethod } from '../../core/sagas/utils';

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
  COLONY_DOMAINS_FETCH,
  COLONY_DOMAINS_FETCH_ERROR,
  COLONY_DOMAINS_FETCH_SUCCESS,
  DOMAIN_CREATE,
  DOMAIN_CREATE_ERROR,
  DOMAIN_CREATE_SUCCESS,
  DOMAIN_CREATE_TX_ERROR,
  DOMAIN_CREATE_TX_SUCCESS,
  DOMAIN_FETCH,
  DOMAIN_FETCH_ERROR,
  DOMAIN_FETCH_SUCCESS,
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
  createDomain as createDomainAction,
} from '../actionCreators';

import { domainSelector } from '../selectors';

function* createColonyStoreNew(transactions) {
  const [, { eventData }] = transactions;
  const colonyAddress = eventData && eventData.colonyAddress;
  // TODO Do the store creation here, return actual store address
  const tempStoreAddress = yield colonyAddress;
  return tempStoreAddress;
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
      before: createColonyStoreNew,
      transferParams: (transactions, orbitDBPath) => ({ orbitDBPath }),
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
  // Step 1: Do whatever needs to be done before starting the batch tx

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
        params: { colonyName },
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

function* getColonyContext(colonyENSName): Saga<Object> {
  const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
  const wallet = yield* getContext(CONTEXT.WALLET);
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyENSName,
  );
  return {
    ddb,
    colonyClient,
    wallet,
    metadata: {
      colonyENSName,
      colonyAddress: colonyClient.contract.address,
    },
  };
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
  const context = yield* getColonyContext(ensName);
  const args = {
    address: colonyAddress,
    ensName,
    name: colonyName,
    token: {
      address: tokenAddress,
      icon: tokenIcon,
      name: tokenName,
      symbol: tokenSymbol,
    },
  };

  const colonyStore = yield* executeCommand(context, createColonyProfile, args);

  // @TODO: Should we actually dispatch and action to fetch it from the store?
  // Dispatch and action to set the current colony in the app state (simulating fetching it)
  const fetchSuccessAction = {
    type: COLONY_FETCH_SUCCESS,
    meta: { ...meta, keyPath: [ensName] },
    payload: args,
  };

  yield put(fetchSuccessAction);

  /*
   * Dispatch an action to create the given ENS name for the colony.
   */
  yield put(
    createColonyLabel({
      identifier: colonyAddress,
      params: {
        colonyName: ensName,
        orbitDBPath: colonyStore.address.toString(),
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
  payload,
}: UniqueActionWithKeyPath): Saga<void> {
  const context = yield* getColonyContext(ensName);
  const { colonyName, description, guideline, website } = payload;
  const args = {
    name: colonyName,
    description,
    guideline,
    website,
  };

  try {
    yield* executeCommand(context, updateColonyProfile, args);
    /*
     * Update the colony in the redux store to show the updated values
     */
    yield put({
      type: COLONY_PROFILE_UPDATE_SUCCESS,
      meta,
      payload: args,
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
    const context = yield* getColonyContext(ensName);
    const payload = yield* executeQuery(context, getColony);
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
  payload,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    // first attempt upload to IPFS
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
    const context = yield* getColonyContext(ensName);

    const hash = yield call([ipfsNode, ipfsNode.addString], payload);

    /*
     * Set the avatar's hash in the store
     */
    yield* executeCommand(context, setColonyAvatar, {
      avatar: payload,
      ipfsHash: hash,
    });

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

// @FIXME: Pass in the colony ENS name and use a query
function* fetchColonyAvatar({
  meta,
  meta: {
    keyPath: [hash],
  },
}: UniqueActionWithKeyPath): Saga<void> {
  const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

  try {
    const avatar = yield call([ipfsNode, ipfsNode.getString], hash);

    /*
     * Put the base64 value in the redux state so we can show it
     */
    yield put({
      type: COLONY_AVATAR_FETCH_SUCCESS,
      meta,
      payload: avatar,
    });
  } catch (error) {
    yield putError(COLONY_AVATAR_FETCH_ERROR, error, meta);
  }
}

function* removeColonyAvatarSaga({
  payload: { ipfsHash },
  meta,
  meta: {
    keyPath: [ensName],
  },
}: UniqueActionWithKeyPath): Saga<void> {
  const context = yield* getColonyContext(ensName);
  try {
    /*
     * Remove colony avatar
     */
    yield* executeCommand(context, removeColonyAvatar, { ipfsHash });

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

/*
 * Given a colony identifier and a parent domain ID (1 == root),
 * send a transaction to create a domain, and return the error or
 * success action for the transaction.
 */
function* createDomainTransaction(
  identifier: AddressOrENSName,
  parentDomainId: number = 1,
  meta,
) {
  // TODO fix colonyJS; this should be `parentDomainId`
  const action = createDomainAction({
    identifier,
    params: { parentDomainId },
    options: {
      gasLimit: 500000,
    },
    meta,
  });
  yield put(action);

  return yield take(
    ({ type, meta: actionMeta }) =>
      [DOMAIN_CREATE_TX_ERROR, DOMAIN_CREATE_TX_SUCCESS].includes(type) &&
      actionMeta.id === action.meta.id,
  );
}

function* createDomainSaga(action: UniqueActionWithKeyPath): Saga<void> {
  const {
    payload: { domainName, parentDomainId = 1 },
    meta: {
      keyPath: [colonyENSName],
    },
    meta,
  } = action;
  try {
    const context = yield* getColonyContext(colonyENSName);
    /*
     * Create the domain on the colony with a transaction.
     * TODO idempotency could be improved here by looking for a pending transaction.
     */
    const domainCreationAction = yield call(
      createDomainTransaction,
      colonyENSName,
      parentDomainId,
      meta,
    );

    /*
     * If an error has already been `put`, simply exit.
     */
    if (domainCreationAction.type === DOMAIN_CREATE_ERROR) return;

    /*
     * Get the new domain ID from the successful transaction.
     */
    const { domainId } = domainCreationAction.payload.eventData;

    /*
     * Add an entry to `domainsIndex` on the colony store.
     */
    yield* executeCommand(context, createDomain, {
      domainId,
      name: domainName,
    });
    /*
     * Dispatch a success action with the newly-added domain.
     */
    const payload = { id: domainId, name: domainName };
    yield put({
      type: DOMAIN_CREATE_SUCCESS,
      meta: {
        ...meta,
        keyPath: [colonyENSName, domainId],
      },
      payload,
    });
  } catch (error) {
    yield putError(DOMAIN_CREATE_ERROR, error, meta);
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
  meta,
  payload: { domainId },
}: UniqueActionWithKeyPath): Saga<void> {
  const {
    keyPath: [colonyENSName],
  } = meta;
  try {
    yield call(checkDomainExists, colonyENSName, domainId);
    const domain = yield select(domainSelector, domainId);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: DOMAIN_FETCH_SUCCESS,
      meta,
      payload: domain,
    });
  } catch (error) {
    yield putError(DOMAIN_FETCH_ERROR, error, meta);
  }
}

function* fetchColonyDomainsSaga({
  meta: {
    keyPath: [colonyENSName],
  },
  meta,
}: UniqueActionWithKeyPath): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyENSName);
    const domains = yield* executeQuery(context, getColonyDomains);
    /*
     * Dispatch the success action.
     */
    yield put({
      type: COLONY_DOMAINS_FETCH_SUCCESS,
      meta,
      payload: domains,
    });
  } catch (error) {
    yield putError(COLONY_DOMAINS_FETCH_ERROR, error);
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
  yield takeEvery(COLONY_DOMAINS_FETCH, fetchColonyDomainsSaga);
  yield takeEvery(DOMAIN_CREATE, createDomainSaga);
  yield takeEvery(DOMAIN_FETCH, fetchDomainSaga);

  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(COLONY_AVATAR_REMOVE, removeColonyAvatarSaga);
  yield takeLatest(COLONY_AVATAR_UPLOAD, uploadColonyAvatar);
  yield takeLatest(COLONY_DOMAIN_VALIDATE, validateColonyDomain);
}
