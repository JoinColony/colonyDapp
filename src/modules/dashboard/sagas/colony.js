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
import BigNumber from 'bn.js';

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { getTokenClient } from '~utils/web3/contracts';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import {
  createColonyProfile,
  removeColonyAvatar,
  setColonyAvatar,
  updateColonyProfile,
} from '../data/commands';

import { getColony, getColonyTasks } from '../data/queries';
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

import { subscribeToColony } from '../../users/actionCreators';

import { fetchColony, fetchToken } from '../actionCreators';
import { colonyAvatarHashSelector } from '../selectors';

import { getColonyContext, getColonyAddress, getColonyName } from './shared';

// TODO: Rename, complete and wire up after new onboarding is in place
function* colonyCreateNew({
  meta,
  payload,
}: // $FlowFixMe (not an actual action)
Action<'COLONY_CREATE_NEW'>): Saga<void> {
  const key = 'transaction.batch.createColony';
  const createTokenId = `${meta.id}-createToken`;
  const createColonyId = `${meta.id}-createColony`;
  const createLabelId = `${meta.id}-createLabel`;
  const createTokenChannel = yield call(getTxChannel, createTokenId);
  const createColonyChannel = yield call(getTxChannel, createColonyId);
  const createLabelChannel = yield call(getTxChannel, createLabelId);

  try {
    const { tokenName, tokenSymbol, colonyName } = payload;

    yield fork(createTransaction, createTokenId, {
      context: NETWORK_CONTEXT,
      methodName: 'createToken',
      params: { name: tokenName, symbol: tokenSymbol },
      group: {
        key,
        id: meta.id,
        index: 0,
      },
    });

    yield fork(createTransaction, createColonyId, {
      context: NETWORK_CONTEXT,
      methodName: 'createColony',
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 1,
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
        index: 2,
      },
    });

    yield takeFrom(createTokenChannel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(createColonyChannel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(createLabelChannel, ACTIONS.TRANSACTION_CREATED);

    const {
      payload: {
        transaction: { receipt },
      },
    } = yield takeFrom(createTokenChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(
      transactionAddParams(createColonyId, {
        tokenAddress: receipt && receipt.contractAddress,
      }),
    );

    yield put(transactionReady(createColonyId));

    const {
      payload: {
        transaction: { eventData },
      },
    } = yield takeFrom(createColonyChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put(
      transactionAddParams(createLabelId, {
        // TODO: get orbit db path from somewhere
        orbitDBPath: 'temp',
      }),
    );

    yield put(
      transactionAddIdentifier(
        createLabelId,
        eventData && eventData.colonyAddress,
      ),
    );

    yield put(transactionReady(createLabelId));

    yield takeFrom(createLabelChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put({
      type: ACTIONS.COLONY_CREATE_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_ERROR, error, meta);
  } finally {
    createTokenChannel.close();
    createColonyChannel.close();
    createLabelChannel.close();
  }
}

function* colonyCreate({
  payload: { tokenAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_CREATE>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: NETWORK_CONTEXT,
      methodName: 'createColony',
      params: { tokenAddress },
    });

    // TODO: These are just temporary for now until we have the new onboarding workflow
    // Normally these are done by the user
    yield put({
      type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
      meta,
    });
    yield takeFrom(txChannel, ACTIONS.TRANSACTION_GAS_UPDATE);
    yield put({
      type: ACTIONS.TRANSACTION_SEND,
      meta,
    });
    // TODO temp end

    const { payload } = yield takeFrom(
      txChannel,
      ACTIONS.TRANSACTION_SUCCEEDED,
    );

    yield put({
      type: ACTIONS.COLONY_CREATE_SUCCESS,
      meta,
      payload,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_ERROR, error);
  } finally {
    txChannel.close();
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

    // TODO: These are just temporary for now until we have the new onboarding workflow
    // Normally these are done by the user
    yield put({
      type: ACTIONS.TRANSACTION_ESTIMATE_GAS,
      meta,
    });
    yield takeFrom(txChannel, ACTIONS.TRANSACTION_GAS_UPDATE);
    yield put({
      type: ACTIONS.TRANSACTION_SEND,
      meta,
    });
    // TODO temp end

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

function* colonyDomainValidate({
  payload: { colonyName },
  meta,
}: Action<typeof ACTIONS.COLONY_DOMAIN_VALIDATE>): Saga<void> {
  yield delay(300);

  const colonyAddress = yield call(getColonyAddress, colonyName);

  if (colonyAddress) {
    yield putError(
      ACTIONS.COLONY_DOMAIN_VALIDATE_ERROR,
      new Error('ENS address already exists'),
      meta,
    );
    return;
  }
  yield put<Action<typeof ACTIONS.COLONY_DOMAIN_VALIDATE_SUCCESS>>({
    type: ACTIONS.COLONY_DOMAIN_VALIDATE_SUCCESS,
    meta,
    payload: undefined,
  });
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
    // TODO error if the colony does not exist!
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
            meta: { keyPath: [colonyAddress, tokenAddress] },
            payload: { colonyAddress },
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
      meta: { keyPath: [colonyAddress] },
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
  meta,
  meta: {
    keyPath: [, tokenAddress],
  },
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_TOKEN_BALANCE_FETCH>) {
  try {
    const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);
    const tokenClient = yield call(getTokenClient, tokenAddress, networkClient);
    const { amount } = yield call(
      [tokenClient.getBalanceOf, tokenClient.getBalanceOf.call],
      { sourceAddress: colonyAddress },
    );
    // convert from Ethers BN
    const balance = new BigNumber(amount.toString());
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
      meta,
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TOKEN_BALANCE_FETCH_ERROR, error, meta);
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
      meta: { keyPath: [colonyAddress] },
      payload: { colonyAddress, colonyTasks },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR, error, meta);
  }
}

export default function* colonySagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  // TODO: rename properly once the new onboarding is done
  yield takeEvery('COLONY_CREATE_NEW', colonyCreateNew);
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
  yield takeLatest(ACTIONS.COLONY_DOMAIN_VALIDATE, colonyDomainValidate);
}
