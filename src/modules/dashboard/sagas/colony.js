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

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import {
  removeColonyAvatar,
  setColonyAvatar,
  updateColonyProfile,
} from '../data/commands';

import {
  checkColonyNameIsAvailable,
  getColony,
  getColonyCanMintNativeToken,
  getColonyTasks,
  getColonyTokenBalance,
} from '../data/queries';

import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { COLONY_CONTEXT, TOKEN_CONTEXT } from '../../core/constants';
import { networkVersionSelector } from '../../core/selectors';

import { fetchColony, fetchToken } from '../actionCreators';
import { colonyAvatarHashSelector } from '../selectors';
import { getColonyAddress, getColonyName } from './shared';

import { createAddress } from '~types';

function* colonyNameCheckAvailability({
  payload: { colonyName },
  meta,
}: Action<typeof ACTIONS.COLONY_NAME_CHECK_AVAILABILITY>): Saga<void> {
  try {
    yield delay(300);

    const isAvailable = yield* executeQuery(checkColonyNameIsAvailable, {
      args: { colonyName },
    });

    if (!isAvailable) {
      throw new Error(`ENS address for colony "${colonyName}" already exists`);
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
    yield* executeCommand(updateColonyProfile, {
      args: {
        description,
        displayName,
        guideline,
        website,
      },
      metadata: { colonyAddress },
    });

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
    const payload = yield* executeQuery(getColony, {
      args: { colonyAddress },
      metadata: { colonyAddress },
    });
    yield put<Action<typeof ACTIONS.COLONY_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_FETCH_SUCCESS,
      meta,
      payload,
    });

    // dispatch actions to fetch info and balances for each colony token
    yield all(
      Object.keys(payload.tokens || {})
        .map(createAddress)
        .reduce(
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

    // fetch whether the user is allowed to mint tokens via the colony
    yield put<Action<typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH>>({
      type: ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
      meta: { key: colonyAddress },
      payload: { colonyAddress },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_FETCH_ERROR, error, meta);
  }
}

function* colonyAddressFetch({
  payload: { colonyName },
  meta,
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
    yield putError(ACTIONS.COLONY_ADDRESS_FETCH_ERROR, error, meta);
  }
}

function* colonyNameFetch({
  payload: { colonyAddress },
  meta,
}: Action<typeof ACTIONS.COLONY_NAME_FETCH>): Saga<void> {
  try {
    const colonyName = yield call(getColonyName, colonyAddress);
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
    // first attempt upload to IPFS
    const ipfsHash = yield call(ipfsUpload, data);

    /*
     * Set the avatar's hash in the store
     */
    yield* executeCommand(setColonyAvatar, {
      args: {
        ipfsHash,
      },
      metadata: { colonyAddress },
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
    const ipfsHash = yield select(colonyAvatarHashSelector, colonyAddress);
    /*
     * Remove colony avatar
     */
    yield* executeCommand(removeColonyAvatar, {
      args: {
        ipfsHash,
      },
      metadata: { colonyAddress },
    });

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
    const balance = yield* executeQuery(getColonyTokenBalance, {
      args: { colonyAddress, tokenAddress },
    });

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
    const colonyTasks = yield* executeQuery(getColonyTasks, {
      metadata: { colonyAddress },
    });
    yield put<Action<typeof ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS>>({
      type: ACTIONS.COLONY_TASK_METADATA_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyTasks },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_TASK_METADATA_FETCH_ERROR, error, meta);
  }
}

function* colonyCanMintNativeTokenFetch({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH>): Saga<void> {
  try {
    const canMintNativeToken = yield* executeQuery(
      getColonyCanMintNativeToken,
      {
        metadata: { colonyAddress },
      },
    );
    yield put<
      Action<typeof ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS>,
    >({
      type: ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS,
      meta,
      payload: { canMintNativeToken, colonyAddress },
    });
  } catch (error) {
    yield putError(
      ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR,
      error,
      meta,
    );
  }
}

function* colonyNativeTokenUnlock({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK>): Saga<void> {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: TOKEN_CONTEXT,
      methodName: 'unlock',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ACTIONS.TRANSACTION_SUCCEEDED);

    yield put({
      type: ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS,
      meta,
    });

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    yield putError(ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

export default function* colonySagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  yield takeEvery(
    ACTIONS.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
    colonyCanMintNativeTokenFetch,
  );
  yield takeEvery(ACTIONS.COLONY_FETCH, colonyFetch);
  yield takeEvery(ACTIONS.COLONY_NAME_FETCH, colonyNameFetch);
  yield takeEvery(ACTIONS.COLONY_NATIVE_TOKEN_UNLOCK, colonyNativeTokenUnlock);
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
