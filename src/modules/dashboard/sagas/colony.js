/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  delay,
  fork,
  put,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';
import { replace } from 'connected-react-router';

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
  selectAsJS,
} from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import {
  createColonyProfile,
  removeColonyAvatar,
  setColonyAvatar,
  updateColonyProfile,
} from '../data/commands';

import {
  getColony,
  getColonyTasks,
  getColonyTokenBalance,
} from '../data/queries';
import { NETWORK_CONTEXT } from '../../../lib/ColonyManager/constants';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
} from '../../core/actionCreators';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { COLONY_CONTEXT } from '../../core/constants';
import { networkVersionSelector } from '../../core/selectors';

import { currentUserSelector } from '../../users/selectors';
import { subscribeToColony } from '../../users/actionCreators';
import { userDidClaimProfile } from '../../users/checks';

import { fetchColony, fetchToken } from '../actionCreators';
import { colonyAvatarHashSelector } from '../selectors';

import { getColonyContext, getColonyAddress, getColonyName } from './shared';

function* colonyCreate({
  meta,
  payload: { tokenName, tokenSymbol, colonyName, displayName, username },
}: Action<'COLONY_CREATE'>): Saga<void> {
  const currentUser = yield* selectAsJS(currentUserSelector);
  const usernameCreated = userDidClaimProfile(currentUser);

  /* STEP 1: Create ids to be able to find transactions in their channel */
  const key = 'transaction.batch.createColony';
  const createUserId = `${meta.id}-createUser`;
  const createTokenId = `${meta.id}-createToken`;
  const createColonyId = `${meta.id}-createColony`;
  const createLabelId = `${meta.id}-createLabel`;
  const createUserChannel = yield call(getTxChannel, createUserId);
  const createTokenChannel = yield call(getTxChannel, createTokenId);
  const createColonyChannel = yield call(getTxChannel, createColonyId);
  const createLabelChannel = yield call(getTxChannel, createLabelId);

  /* STEP 2: Create all transactions of createColony transactiongroup */
  try {
    if (!usernameCreated) {
      yield fork(createTransaction, meta.id, {
        context: NETWORK_CONTEXT,
        methodName: 'registerUserLabel',
        params: { username },
        group: {
          key,
          id: meta.id,
          index: 0,
        },
      });
    }

    yield fork(createTransaction, createTokenId, {
      context: NETWORK_CONTEXT,
      methodName: 'createToken',
      params: { name: tokenName, symbol: tokenSymbol },
      group: {
        key,
        id: meta.id,
        index: 1,
      },
    });

    yield fork(createTransaction, createColonyId, {
      context: NETWORK_CONTEXT,
      methodName: 'createColony',
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 2,
      },
    });

    yield fork(createTransaction, createLabelId, {
      context: COLONY_CONTEXT,
      methodName: 'registerColonyLabel',
      params: { colonyName },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 3,
      },
    });

    /* STEP 3: Notify about creation of each transaction in the group so they can
    be added to the gas station  */
    yield takeFrom(createTokenChannel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(createColonyChannel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(createLabelChannel, ACTIONS.TRANSACTION_CREATED);

    /* STEP 4: Fire success to progress to next wizard step where transactions can get
    processed  */
    yield put({
      type: ACTIONS.COLONY_CREATE_SUCCESS,
      meta,
      payload: '',
    });

    /* STEP 5: Some transactions require input from the previous transactions
    pass them through, notify when transaction has succeeded */
    const {
      payload: {
        transaction: {
          receipt: { contractAddress: tokenAddress },
        },
      },
    } = yield takeFrom(createTokenChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(transactionAddParams(createColonyId, { tokenAddress }));

    yield put(transactionReady(createColonyId));

    const {
      payload: {
        eventData: { colonyAddress },
      },
    } = yield takeFrom(createColonyChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    if (colonyAddress) {
      yield putError(
        ACTIONS.COLONY_CREATE_ERROR,
        new Error('Missing colony address'),
        meta,
      );
    }

    /*
     * Create the colony store
     */
    const context = yield* getColonyContext(colonyAddress);
    const args = {
      colonyAddress,
      colonyName,
      displayName,
      token: {
        address: tokenAddress,
        isNative: true,
        name: tokenName,
        symbol: tokenSymbol,
        /**
         * @todo Add missing tokenIcon when creating the colony profile.
         * @body This should be in the action payload.
         */
      },
    };
    const store = yield* executeCommand(context, createColonyProfile, args);

    yield put(subscribeToColony(colonyAddress));

    yield put(
      transactionAddParams(createLabelId, {
        orbitDBPath: store.address.toString(),
      }),
    );

    yield put(transactionAddIdentifier(createLabelId, colonyAddress));

    yield put(transactionReady(createLabelId));

    yield takeFrom(createLabelChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(
      transactionAddParams(createUserId, {
        orbitDBPath: store.address.toString(),
      }),
    );

    yield put(transactionAddIdentifier(createUserId, colonyAddress));

    yield put(transactionReady(createUserId));

    yield takeFrom(createUserChannel, ACTIONS.TRANSACTION_SUCCEEDED);
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_ERROR, error, meta);
  } finally {
    createUserChannel.close();
    createTokenChannel.close();
    createColonyChannel.close();
    createLabelChannel.close();
  }
}

function* colonyCreateLabel({
  payload: {
    colonyAddress,
    colonyName,
    displayName,
    tokenAddress,
    tokenIcon,
    tokenName,
    tokenSymbol,
  },
  meta,
}: Action<typeof ACTIONS.COLONY_CREATE_LABEL>): Saga<void> {
  const context = yield* getColonyContext(colonyAddress);
  const args = {
    colonyAddress,
    colonyName,
    displayName,
    token: {
      address: tokenAddress,
      icon: tokenIcon,
      isNative: true,
      name: tokenName,
      symbol: tokenSymbol,
    },
  };

  /*
   * Get or create a colony store and save the colony to that store.
   */
  const store = yield* executeCommand(context, createColonyProfile, args);

  /*
   * Subscribe the current user to the colony
   */
  yield put(subscribeToColony(colonyAddress));

  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'registerColonyLabel',
      identifier: colonyAddress,
      params: {
        colonyName,
        orbitDBPath: store.address.toString(),
      },
    });

    yield put({
      type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
      meta,
    });
    yield takeFrom(txChannel, ACTIONS.TRANSACTION_GAS_UPDATE);
    yield put({
      type: ACTIONS.TRANSACTION_SEND,
      meta,
    });

    const { payload } = yield takeFrom(
      txChannel,
      ACTIONS.TRANSACTION_SUCCEEDED,
    );

    yield put({
      type: ACTIONS.COLONY_CREATE_LABEL_SUCCESS,
      meta,
      payload,
    });

    yield put(replace(`/colony/${colonyName}`));
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_LABEL_ERROR, error);
  } finally {
    txChannel.close();
  }
}

function* colonyNameCheckAvailability({
  payload: { colonyName },
  meta,
}: Action<typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY>): Saga<void> {
  try {
    yield delay(300);

    /**
     * @todo Define `getColonyAddress` query.
     * @body This should probably be a query at some point, like in `usernameCheckAvailability`.
     */
    const colonyAddress = yield call(getColonyAddress, colonyName);

    if (colonyAddress) {
      throw new Error('ENS address already exists');
    }

    yield put<Action<typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS>>({
      type: ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (caughtError) {
    yield putError(
      ACTIONS.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
      caughtError,
      meta,
    );
  }
}

function* colonyProfileUpdate({
  meta,
  payload: {
    colonyAddress,
    colonyName,
    description,
    displayName,
    guideline,
    website,
  },
}: Action<typeof ACTIONS.COLONY_PROFILE_UPDATE>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
    yield* executeCommand(context, updateColonyProfile, {
      displayName,
      description,
      guideline,
      website,
    });
    /*
     * Update the colony in the redux store to show the updated values
     */
    yield put<Action<typeof ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS>>({
      type: ACTIONS.COLONY_PROFILE_UPDATE_SUCCESS,
      meta,
      payload: {
        colonyAddress,
        colonyName,
        description,
        displayName,
        guideline,
        website,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_PROFILE_UPDATE_ERROR, error, meta);
  }
}

function* colonyFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_FETCH>): Saga<void> {
  try {
    /**
     * @todo Add error mode for fetching a non-existent colony.
     */
    const context = yield* getColonyContext(colonyAddress);
    const payload = yield* executeQuery(context, getColony);
    yield put<Action<typeof ACTIONS.COLONY_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_FETCH_SUCCESS,
      meta,
      payload,
    });

    // dispatch actions to fetch info and balances for each colony token
    yield all(
      Object.keys(payload.tokens || {}).reduce(
        (effects, tokenAddress) => [
          ...effects,
          put(fetchToken(tokenAddress)),
          put<Action<typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH>>({
            type: ACTIONS.COLONY_TOKEN_BALANCE_FETCH,
            payload: { colonyAddress, tokenAddress },
          }),
        ],
        [],
      ),
    );
  } catch (error) {
    yield putError(ACTIONS.COLONY_FETCH_ERROR, error, meta);
  }
}

function* colonyAddressFetch({
  payload: { colonyName },
}: Action<typeof ACTIONS.COLONY_ADDRESS_FETCH>): Saga<void> {
  try {
    const colonyAddress = yield call(getColonyAddress, colonyName);

    if (!colonyAddress)
      throw new Error(`No Colony address found for ENS name "${colonyName}"`);

    yield put<Action<typeof ACTIONS.COLONY_ADDRESS_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_ADDRESS_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_ADDRESS_FETCH_ERROR, error, { colonyName });
  }
}

function* colonyNameFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_NAME_FETCH>): Saga<void> {
  try {
    const colonyName = yield call(getColonyName, colonyAddress);
    if (!colonyName)
      throw new Error(
        `No Colony ENS name found for address "${colonyAddress}"`,
      );

    yield put<Action<typeof ACTIONS.COLONY_NAME_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_NAME_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_NAME_FETCH_ERROR, error, meta);
  }
}

function* colonyAvatarUpload({
  meta,
  payload: { colonyAddress, data },
}: Action<typeof ACTIONS.COLONY_AVATAR_UPLOAD>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
    const ipfsHash = yield call(ipfsUpload, data);

    /*
     * Set the avatar's hash in the store
     */
    yield* executeCommand(context, setColonyAvatar, {
      ipfsHash,
    });

    /*
     * Store the new avatar hash value in the redux store so we can show it
     */
    yield put<Action<typeof ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS>>({
      type: ACTIONS.COLONY_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: { hash: ipfsHash },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_AVATAR_UPLOAD_ERROR, error, meta);
  }
}

function* colonyAvatarRemove({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_AVATAR_REMOVE>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
    const ipfsHash = yield select(colonyAvatarHashSelector, colonyAddress);
    /*
     * Remove colony avatar
     */
    yield* executeCommand(context, removeColonyAvatar, { ipfsHash });

    /*
     * Also set the avatar in the state to undefined (via a reducer)
     */
    yield put<Action<typeof ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS>>({
      type: ACTIONS.COLONY_AVATAR_REMOVE_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_AVATAR_REMOVE_ERROR, error, meta);
  }
}

function* colonyRecoveryModeEnter({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_RECOVERY_MODE_ENTER>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    yield put({
      type: ACTIONS.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.COLONY_RECOVERY_MODE_ENTER_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* colonyUpgradeContract({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_VERSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const newVersion = yield select(networkVersionSelector);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'upgrade',
      identifier: colonyAddress,
      params: { newVersion },
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_CREATED);

    yield put({
      type: ACTIONS.COLONY_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.COLONY_VERSION_UPGRADE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* colonyTokenBalanceFetch({
  payload: { colonyAddress, tokenAddress },
}: Action<typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH>) {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const { metadata } = yield* getColonyContext(colonyAddress);
    const balance = yield* executeQuery(
      { metadata, networkClient },
      getColonyTokenBalance,
      tokenAddress,
    );

    yield put({
      type: ACTIONS.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
      payload: {
        token: {
          address: tokenAddress,
          balance,
        },
        tokenAddress,
        colonyAddress,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TOKEN_BALANCE_FETCH_ERROR, error);
  }
}

/*
 * Given a colony address, dispatch actions to fetch all tasks
 * for that colony.
 */
function* colonyTaskMetadataFetch({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_TASK_METADATA_FETCH>): Saga<void> {
  try {
    const context = yield* getColonyContext(colonyAddress);
    const colonyTasks = yield* executeQuery(context, getColonyTasks);

    yield put<Action<typeof ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyTasks },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR, error, meta);
  }
}

export default function* colonySagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  yield takeEvery(ACTIONS.COLONY_CREATE, colonyCreate);
  yield takeEvery(ACTIONS.COLONY_CREATE_LABEL, colonyCreateLabel);
  yield takeEvery(ACTIONS.COLONY_FETCH, colonyFetch);
  yield takeEvery(ACTIONS.COLONY_NAME_FETCH, colonyNameFetch);
  yield takeEvery(ACTIONS.COLONY_PROFILE_UPDATE, colonyProfileUpdate);
  yield takeEvery(ACTIONS.COLONY_RECOVERY_MODE_ENTER, colonyRecoveryModeEnter);
  yield takeEvery(ACTIONS.COLONY_TASK_METADATA_FETCH, colonyTaskMetadataFetch);
  yield takeEvery(ACTIONS.COLONY_TOKEN_BALANCE_FETCH, colonyTokenBalanceFetch);
  yield takeEvery(ACTIONS.COLONY_VERSION_UPGRADE, colonyUpgradeContract);
  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(ACTIONS.COLONY_AVATAR_REMOVE, colonyAvatarRemove);
  yield takeLatest(ACTIONS.COLONY_AVATAR_UPLOAD, colonyAvatarUpload);
  yield takeLatest(
    ACTIONS.COLONY_NAME_CHECK_AVAILABILITY,
    colonyNameCheckAvailability,
  );
}
