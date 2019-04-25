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
  selectAsJS,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';
import { CONTEXT, getContext } from '~context';

import {
  createColonyProfile,
  removeColonyAvatar,
  setColonyAvatar,
  updateColonyProfile,
} from '../data/commands';

import { createUserProfile } from '../../users/data/commands';

import {
  getColony,
  getColonyTasks,
  getColonyTokenBalance,
} from '../data/queries';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
} from '../../core/actionCreators';
import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
  TOKEN_CONTEXT,
} from '../../core/constants';
import { networkVersionSelector } from '../../core/selectors';

import {
  currentUserSelector,
  walletAddressSelector,
} from '../../users/selectors';
import { subscribeToColony } from '../../users/actionCreators';
import { userDidClaimProfile } from '../../users/checks';

import { fetchColony, fetchToken } from '../actionCreators';
import { colonyAvatarHashSelector } from '../selectors';
import { getColonyAddress, getColonyName } from './shared';

function* colonyCreate({
  meta,
  payload: {
    tokenName,
    tokenSymbol,
    tokenIcon,
    colonyName,
    displayName,
    username,
  },
}: Action<typeof ACTIONS.COLONY_CREATE>): Saga<void> {
  const currentUser = yield* selectAsJS(currentUserSelector);
  const usernameCreated = userDidClaimProfile(currentUser);

  /* STEP 1: Create ids to be able to find transactions in their channel */
  const key = 'transaction.batch.createColony';
  const [ids, channels] = yield call(createTransactionChannels, meta.id, [
    'createUser',
    'createToken',
    'createColony',
    'createLabel',
    'deployTokenAuthority',
    'setTokenAuthority',
    'deployOneTx',
    'setOneTxRole',
    'deployOldRoles',
    'setOldRolesRole',
  ]);

  /* STEP 2: Create all transactions of createColony transactiongroup */
  try {
    if (!usernameCreated) {
      yield fork(createTransaction, ids.createUser, {
        context: NETWORK_CONTEXT,
        methodName: 'registerUserLabel',
        ready: false,
        params: { username },
        group: {
          key,
          id: meta.id,
          index: 0,
        },
      });

      /*
       * Create the profile store
       */
      const walletAddress = yield select(walletAddressSelector);
      const { profileStore, metadataStore, inboxStore } = yield* executeCommand(
        createUserProfile,
        {
          args: { username, walletAddress },
          metadata: { walletAddress },
        },
      );

      yield put<Action<typeof ACTIONS.USERNAME_CREATE_SUCCESS>>({
        type: ACTIONS.USERNAME_CREATE_SUCCESS,
        payload: {
          inboxStoreAddress: inboxStore.address.toString(),
          metadataStoreAddress: metadataStore.address.toString(),
          username,
        },
        meta,
      });
      yield put(
        transactionAddParams(ids.createUser, {
          orbitDBPath: profileStore.address.toString(),
        }),
      );

      yield put(transactionReady(ids.createUser));
    }

    yield fork(createTransaction, ids.createToken, {
      context: NETWORK_CONTEXT,
      methodName: 'createToken',
      params: { name: tokenName, symbol: tokenSymbol, decimals: 18 },
      group: {
        key,
        id: meta.id,
        index: 1,
      },
    });

    yield fork(createTransaction, ids.createColony, {
      context: NETWORK_CONTEXT,
      methodName: 'createColony',
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 2,
      },
    });

    yield fork(createTransaction, ids.createLabel, {
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

    yield fork(createTransaction, ids.deployTokenAuthority, {
      context: TOKEN_CONTEXT,
      methodName: 'createTokenAuthority',
      params: { allowedToTransfer: [] },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 4,
      },
    });

    yield fork(createTransaction, ids.setTokenAuthority, {
      context: TOKEN_CONTEXT,
      methodName: 'setAuthority',
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 5,
      },
    });

    yield fork(createTransaction, ids.deployOneTx, {
      context: COLONY_CONTEXT,
      methodName: 'addExtension',
      params: { contractName: 'OneTxPayment' },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 6,
      },
    });

    yield fork(createTransaction, ids.setOneTxRole, {
      context: COLONY_CONTEXT,
      methodName: 'setRootRole',
      params: { setTo: true },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 7,
      },
      methodContext: 'setOneTxRole',
    });

    yield fork(createTransaction, ids.deployOldRoles, {
      context: COLONY_CONTEXT,
      methodName: 'addExtension',
      params: { contractName: 'OldRoles' },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 8,
      },
    });

    yield fork(createTransaction, ids.setOldRolesRole, {
      context: COLONY_CONTEXT,
      methodName: 'setRootRole',
      params: { setTo: true },
      ready: false,
      group: {
        key,
        id: meta.id,
        index: 9,
      },
      methodContext: 'setOldRolesRole',
    });

    /* STEP 3: Notify about creation of each transaction in the group so they can
    be added to the gas station  */
    if (!usernameCreated) {
      yield takeFrom(channels.createUser, ACTIONS.TRANSACTION_CREATED);
    }
    yield takeFrom(channels.createToken, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.createColony, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.createLabel, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.deployTokenAuthority, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.setTokenAuthority, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.deployOneTx, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.setOneTxRole, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.deployOldRoles, ACTIONS.TRANSACTION_CREATED);
    yield takeFrom(channels.setOldRolesRole, ACTIONS.TRANSACTION_CREATED);

    /* STEP 4: Fire success to progress to next wizard step where transactions can get
    processed  */
    yield put<Action<typeof ACTIONS.COLONY_CREATE_SUCCESS>>({
      type: ACTIONS.COLONY_CREATE_SUCCESS,
      meta,
      payload: undefined,
    });

    /* STEP 5: Some transactions require input from the previous transactions
    pass them through, notify when transaction has succeeded */

    const {
      payload: {
        transaction: {
          receipt: { contractAddress: tokenAddress },
        },
      },
    } = yield takeFrom(channels.createToken, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Pass through tokenAddress after token creation to colony creation
     */
    yield put(transactionAddParams(ids.createColony, { tokenAddress }));

    yield put(transactionReady(ids.createColony));

    const {
      payload: {
        eventData: { colonyAddress },
      },
    } = yield takeFrom(channels.createColony, ACTIONS.TRANSACTION_SUCCEEDED);

    if (!colonyAddress) {
      yield putError(
        ACTIONS.COLONY_CREATE_ERROR,
        new Error('Missing colony address'),
        meta,
      );
    }

    /*
     * Create the colony store
     */
    const colonyStore = yield* executeCommand(createColonyProfile, {
      metadata: { colonyAddress },
      args: {
        colonyAddress,
        colonyName,
        displayName,
        token: {
          address: tokenAddress,
          iconHash: tokenIcon ? tokenIcon[0].uploaded.ipfsHash : undefined,
          isNative: true,
          name: tokenName,
          symbol: tokenSymbol,
        },
      },
    });

    yield put(subscribeToColony(colonyAddress));

    /*
     * Pass through colonyStore Address after colony store creation to colonyName creation
     */
    yield put(
      transactionAddParams(ids.createLabel, {
        orbitDBPath: colonyStore.address.toString(),
      }),
    );
    yield put(transactionAddIdentifier(ids.createLabel, colonyAddress));
    yield put(
      transactionAddIdentifier(ids.deployTokenAuthority, colonyAddress),
    );
    yield put(transactionAddIdentifier(ids.setTokenAuthority, colonyAddress));
    yield put(transactionAddIdentifier(ids.deployOneTx, colonyAddress));
    yield put(transactionAddIdentifier(ids.setOneTxRole, colonyAddress));
    yield put(transactionAddIdentifier(ids.deployOldRoles, colonyAddress));
    yield put(transactionAddIdentifier(ids.setOldRolesRole, colonyAddress));

    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
    const colonyClient = yield call(
      [colonyManager, colonyManager.getColonyClient],
      colonyAddress,
    );

    /*
     * Create label
     */
    yield put(transactionReady(ids.createLabel));
    yield takeFrom(channels.createLabel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Deploy TokenAuthority
     */
    yield put(
      transactionAddParams(ids.deployTokenAuthority, {
        colonyAddress,
        tokenAddress,
      }),
    );
    yield put(transactionReady(ids.deployTokenAuthority));
    const {
      payload: {
        transaction: {
          receipt: { contractAddress: tokenAuthorityAddress },
        },
      },
    } = yield takeFrom(
      channels.deployTokenAuthority,
      ACTIONS.TRANSACTION_SUCCEEDED,
    );

    /*
     * Set Token authority (to deployed TokenAuthority)
     */
    yield put(
      transactionAddParams(ids.setTokenAuthority, {
        authority: tokenAuthorityAddress,
      }),
    );
    yield put(transactionReady(ids.setTokenAuthority));
    yield takeFrom(channels.setTokenAuthority, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Deploy OneTx
     */
    yield put(transactionReady(ids.deployOneTx));
    yield takeFrom(channels.deployOneTx, ACTIONS.TRANSACTION_SUCCEEDED);
    const { address: oneTxAddress } = yield call(
      [colonyClient.getExtensionAddress, colonyClient.getExtensionAddress.call],
      { contractName: 'OneTxPayment' },
    );

    /*
     * Set OneTx role
     */
    yield put(
      transactionAddParams(ids.setOneTxRole, { address: oneTxAddress }),
    );
    yield put(transactionReady(ids.setOneTxRole));
    yield takeFrom(channels.setOneTxRole, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Deploy OldRoles
     */
    yield put(transactionReady(ids.deployOldRoles));
    yield takeFrom(channels.deployOldRoles, ACTIONS.TRANSACTION_SUCCEEDED);
    const { address: oldRolesAddress } = yield call(
      [colonyClient.getExtensionAddress, colonyClient.getExtensionAddress.call],
      { contractName: 'OldRoles' },
    );

    /*
     * Set OldRoles role
     */
    yield put(
      transactionAddParams(ids.setOldRolesRole, {
        address: oldRolesAddress,
      }),
    );
    yield put(transactionReady(ids.setOldRolesRole));
    yield takeFrom(channels.setOldRolesRole, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Notification
     */
    yield put<Action<typeof ACTIONS.USER_ACTIVITIES_ADD_SUCCESS>>({
      type: ACTIONS.USER_ACTIVITIES_ADD_SUCCESS,
      payload: {
        activity: {
          id: nanoid(),
          event: 'notificationAdminENSCreated',
          userAddress: walletAddress,
          colonyName,
          colonyAddress,
          timestamp: new Date(),
        },
      },
      meta: {
        key: [colonyName],
        ...meta,
      },
    });
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_ERROR, error, meta);
  } finally {
    channels.createUser.close();
    channels.createToken.close();
    channels.createColony.close();
    channels.createLabel.close();
    channels.deployOneTx.close();
    channels.setOneTxRole.close();
    channels.deployOldRoles.close();
    channels.setOldRolesRole.close();
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
    /**
     * @todo Add error mode for fetching a non-existent colony.
     */
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

export default function* colonySagas(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_ADDRESS_FETCH, colonyAddressFetch);
  yield takeEvery(ACTIONS.COLONY_CREATE, colonyCreate);
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
