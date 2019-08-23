import {
  all,
  call,
  delay,
  fork,
  put,
  take,
  takeEvery,
  takeLatest,
  select,
} from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
  executeSubscription,
} from '~utils/saga/effects';
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
  subscribeToColony,
  subscribeToColonyTasks,
} from '../data/queries';
import { createTransaction, getTxChannel } from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import { COLONY_CONTEXT, TOKEN_CONTEXT } from '../../core/constants';
import { networkVersionSelector } from '../../core/selectors';
import {
  fetchColony,
  fetchToken,
  fetchColonyCanMintNativeToken,
  fetchColonyTokenBalance,
} from '../actionCreators';
import { colonyAvatarHashSelector, colonySelector } from '../selectors';
import { getColonyAddress, getColonyName } from './shared';
import { createAddress } from '~types/index';

function* colonyNameCheckAvailability({
  payload: { colonyName },
  meta,
}: Action<ActionTypes.COLONY_NAME_CHECK_AVAILABILITY>) {
  try {
    yield delay(300);

    const isAvailable = yield executeQuery(checkColonyNameIsAvailable, {
      args: { colonyName },
    });

    if (!isAvailable) {
      throw new Error(`ENS address for colony "${colonyName}" already exists`);
    }

    yield put<AllActions>({
      type: ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_NAME_CHECK_AVAILABILITY_ERROR,
      caughtError,
      meta,
    );
  }
  return null;
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
}: Action<ActionTypes.COLONY_PROFILE_UPDATE>) {
  try {
    yield executeCommand(updateColonyProfile, {
      args: {
        description,
        displayName,
        guideline,
        website,
      },
      metadata: { colonyAddress },
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_PROFILE_UPDATE_SUCCESS,
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
    return yield putError(ActionTypes.COLONY_PROFILE_UPDATE_ERROR, error, meta);
  }
  return null;
}

function* colonyFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_FETCH>) {
  try {
    const colony = yield executeQuery(getColony, {
      args: { colonyAddress },
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_FETCH_SUCCESS,
      meta,
      payload: colony,
    });

    // dispatch actions to fetch info and balances for each colony token
    yield all(
      Object.keys(colony.tokens || {})
        .map(createAddress)
        .reduce(
          (effects, tokenAddress) => [
            ...effects,
            put(fetchToken(tokenAddress)),
            put<AllActions>({
              type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
              payload: { colonyAddress, tokenAddress },
            }),
          ],
          [],
        ),
    );

    // fetch whether the user is allowed to mint tokens via the colony
    yield put<AllActions>({
      type: ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
      meta: { key: colonyAddress },
      payload: { colonyAddress },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyAddressFetch({
  payload: { colonyName },
  meta,
}: Action<ActionTypes.COLONY_ADDRESS_FETCH>) {
  try {
    const colonyAddress = yield call(getColonyAddress, colonyName);

    if (!colonyAddress)
      throw new Error(`No Colony address found for ENS name "${colonyName}"`);

    yield put<AllActions>({
      type: ActionTypes.COLONY_ADDRESS_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_ADDRESS_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyNameFetch({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_NAME_FETCH>) {
  try {
    const colonyName = yield call(getColonyName, colonyAddress);
    yield put<AllActions>({
      type: ActionTypes.COLONY_NAME_FETCH_SUCCESS,
      meta,
      payload: { colonyAddress, colonyName },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_NAME_FETCH_ERROR, error, meta);
  }
  return null;
}

function* colonyAvatarUpload({
  meta,
  payload: { colonyAddress, data },
}: Action<ActionTypes.COLONY_AVATAR_UPLOAD>) {
  try {
    // first attempt upload to IPFS
    const ipfsHash = yield call(ipfsUpload, data);

    /*
     * Set the avatar's hash in the store
     */
    yield executeCommand(setColonyAvatar, {
      args: {
        ipfsHash,
      },
      metadata: { colonyAddress },
    });

    /*
     * Store the new avatar hash value in the redux store so we can show it
     */
    yield put<AllActions>({
      type: ActionTypes.COLONY_AVATAR_UPLOAD_SUCCESS,
      meta,
      payload: { hash: ipfsHash },
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_AVATAR_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* colonyAvatarRemove({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_AVATAR_REMOVE>) {
  try {
    const ipfsHash = yield select(colonyAvatarHashSelector, colonyAddress);

    /*
     * Remove colony avatar
     */
    yield executeCommand(removeColonyAvatar, {
      args: {
        ipfsHash,
      },
      metadata: { colonyAddress },
    });

    /*
     * Also set the avatar in the state to undefined (via a reducer)
     */
    yield put<AllActions>({
      type: ActionTypes.COLONY_AVATAR_REMOVE_SUCCESS,
      meta,
      payload: undefined,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_AVATAR_REMOVE_ERROR, error, meta);
  }
  return null;
}

function* colonyRecoveryModeEnter({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_RECOVERY_MODE_ENTER>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_RECOVERY_MODE_ENTER_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_RECOVERY_MODE_ENTER_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyUpgradeContract({
  payload: { colonyAddress },
  meta,
}: Action<ActionTypes.COLONY_VERSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  const newVersion = yield select(networkVersionSelector);

  try {
    yield fork(createTransaction, meta.id, {
      context: COLONY_CONTEXT,
      methodName: 'upgrade',
      identifier: colonyAddress,
      params: { newVersion },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put({
      type: ActionTypes.COLONY_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_VERSION_UPGRADE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyTokenBalanceFetch({
  payload: { colonyAddress, tokenAddress },
}: Action<ActionTypes.COLONY_TOKEN_BALANCE_FETCH>) {
  try {
    const balance = yield executeQuery(getColonyTokenBalance, {
      args: { tokenAddress },
      metadata: { colonyAddress },
    });

    yield put({
      type: ActionTypes.COLONY_TOKEN_BALANCE_FETCH_SUCCESS,
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
    return yield putError(ActionTypes.COLONY_TOKEN_BALANCE_FETCH_ERROR, error);
  }
  return null;
}

/*
 * Given a colony address, dispatch actions to fetch all tasks
 * for that colony.
 */
function* colonyTaskMetadataFetch({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_TASK_METADATA_FETCH>) {
  try {
    const colonyTasks = yield executeQuery(getColonyTasks, {
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_TASK_METADATA_FETCH_SUCCESS,
      meta: { key: colonyAddress },
      payload: { colonyAddress, colonyTasks },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_TASK_METADATA_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* colonyCanMintNativeTokenFetch({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH>) {
  try {
    const canMintNativeToken = yield executeQuery(getColonyCanMintNativeToken, {
      metadata: { colonyAddress },
    });
    yield put<AllActions>({
      type: ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_SUCCESS,
      meta,
      payload: { canMintNativeToken, colonyAddress },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH_ERROR,
      error,
      meta,
    );
  }
  return null;
}

function* colonyNativeTokenUnlock({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: TOKEN_CONTEXT,
      methodName: 'unlock',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS,
      meta,
    });

    yield put(fetchColony(colonyAddress));
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonySubStart({ payload: { colonyAddress }, meta }: any) {
  // @TODO: Generalize subscription sagas
  // @BODY This could be generalised (it's very similar to the above function),
  // but it's probably worth waiting to see, as this pattern will likely change
  // as it gets used elsewhere.
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToColony, {
      metadata: { colonyAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.COLONY_SUB_STOP &&
          action.payload.colonyAddress === colonyAddress,
      );
      channel.close();
    });

    const reduceTokenToDispatch = (acc, token) =>
      token.balance === undefined
        ? [
            ...acc,
            put(fetchColonyTokenBalance(colonyAddress, token.address)),
            put(fetchToken(token.address)),
          ]
        : acc;

    while (true) {
      const colony = yield take(channel);
      yield put({
        type: ActionTypes.COLONY_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          colony,
        },
      });

      // select the freshly updated colony
      const { record: colonyFromState } = yield select(
        colonySelector,
        colonyAddress,
      );

      // fetch canMintNativeToken if we didn't already
      if (colonyFromState.canMintNativeToken === undefined) {
        yield put(fetchColonyCanMintNativeToken(colonyAddress));
      }

      // fetch token balances for those which we have loaded
      if (colonyFromState.tokens) {
        yield all(
          colonyFromState.tokens.toList().reduce(reduceTokenToDispatch, []),
        );
      }
    }
  } catch (caughtError) {
    return yield putError(ActionTypes.COLONY_SUB_ERROR, caughtError, meta);
  } finally {
    if (channel && typeof channel.close === 'function') {
      channel.close();
    }
  }
}

function* colonyTaskMetadataSubStart({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_TASK_METADATA_SUB_START>) {
  let channel;
  try {
    channel = yield call(executeSubscription, subscribeToColonyTasks, {
      metadata: { colonyAddress },
    });

    yield fork(function* stopSubscription() {
      yield take(
        action =>
          action.type === ActionTypes.COLONY_TASK_METADATA_SUB_STOP &&
          action.payload.colonyAddress === colonyAddress,
      );
      channel.close();
    });

    while (true) {
      const colonyTasks = yield take(channel);
      yield put({
        type: ActionTypes.COLONY_TASK_METADATA_SUB_EVENTS,
        meta,
        payload: {
          colonyAddress,
          colonyTasks,
        },
      });
    }
  } catch (caughtError) {
    return yield putError(
      ActionTypes.COLONY_TASK_METADATA_SUB_ERROR,
      caughtError,
      meta,
    );
  } finally {
    if (channel && typeof channel.close == 'function') {
      channel.close();
    }
  }
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  yield takeEvery(
    ActionTypes.COLONY_CAN_MINT_NATIVE_TOKEN_FETCH,
    colonyCanMintNativeTokenFetch,
  );
  yield takeEvery(ActionTypes.COLONY_FETCH, colonyFetch);
  yield takeEvery(ActionTypes.COLONY_NAME_FETCH, colonyNameFetch);
  yield takeEvery(
    ActionTypes.COLONY_NATIVE_TOKEN_UNLOCK,
    colonyNativeTokenUnlock,
  );
  yield takeEvery(ActionTypes.COLONY_PROFILE_UPDATE, colonyProfileUpdate);
  yield takeEvery(
    ActionTypes.COLONY_RECOVERY_MODE_ENTER,
    colonyRecoveryModeEnter,
  );
  yield takeEvery(
    ActionTypes.COLONY_TASK_METADATA_FETCH,
    colonyTaskMetadataFetch,
  );
  yield takeEvery(
    ActionTypes.COLONY_TOKEN_BALANCE_FETCH,
    colonyTokenBalanceFetch,
  );
  yield takeEvery(ActionTypes.COLONY_VERSION_UPGRADE, colonyUpgradeContract);

  /*
   * Note that the following actions use `takeLatest` because they are
   * dispatched on user keyboard input and use the `delay` saga helper.
   */
  yield takeLatest(ActionTypes.COLONY_AVATAR_REMOVE, colonyAvatarRemove);
  yield takeLatest(ActionTypes.COLONY_AVATAR_UPLOAD, colonyAvatarUpload);
  yield takeLatest(
    ActionTypes.COLONY_NAME_CHECK_AVAILABILITY,
    colonyNameCheckAvailability,
  );
  yield takeEvery(ActionTypes.COLONY_SUB_START, colonySubStart);
  yield takeEvery(
    ActionTypes.COLONY_TASK_METADATA_SUB_START,
    colonyTaskMetadataSubStart,
  );
}
