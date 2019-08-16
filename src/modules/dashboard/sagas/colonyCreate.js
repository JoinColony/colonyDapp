/* @flow */

import type { Channel, Saga } from 'redux-saga';

import {
  all,
  call,
  fork,
  put,
  take,
  takeEvery,
  select,
} from 'redux-saga/effects';
import BigNumber from 'bn.js';

import type { Action } from '~redux';

import {
  putError,
  takeFrom,
  executeCommand,
  executeQuery,
  selectAsJS,
  putNotification,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';
import { CONTEXT, getContext } from '~context';
import ENS from '~lib/ENS';
import { createAddress } from '~types';

import { decorateLog } from '~utils/web3/eventLogs/events';
import { parseExtensionDeployedLog } from '~utils/web3/eventLogs/eventParsers';
import { normalizeTransactionLog } from '~data/normalizers';

import type { TxConfig } from '../../core/types';

import { createUserProfile } from '../../users/data/commands';
import { getProfileStoreAddress } from '../../users/data/queries';

import {
  transactionAddParams,
  transactionAddIdentifier,
  transactionReady,
  transactionLoadRelated,
} from '../../core/actionCreators';
import { createTransaction, createTransactionChannels } from '../../core/sagas';
import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
  TOKEN_CONTEXT,
} from '../../core/constants';

import {
  currentUserSelector,
  walletAddressSelector,
} from '../../users/selectors';
import {
  subscribeToColony,
  userPermissionsFetch,
} from '../../users/actionCreators';
import { userDidClaimProfile } from '../../users/checks';

import { createColonyProfile } from '../data/commands';
import { getColonyName } from './shared';

function* colonyCreate({
  meta,
  payload: {
    colonyName: givenColonyName,
    displayName,
    tokenAddress: givenTokenAddress,
    tokenChoice,
    tokenIcon,
    tokenName,
    tokenSymbol,
    username: givenUsername,
  },
}: Action<typeof ACTIONS.COLONY_CREATE>): Saga<*> {
  /*
   * Get the current user's wallet address (needed for notifications).
   */
  const walletAddress = yield select(walletAddressSelector);
  const currentUser = yield* selectAsJS(currentUserSelector);

  /*
   * Define a manifest of transaction ids and their respective channels.
   */
  const channels: {
    [id: string]: {| channel: Channel<*>, index: number, id: string |},
  } = yield call(createTransactionChannels, meta.id, [
    /*
     * If the user did not claim a profile yet, define a tx to create the user.
     */
    ...(!userDidClaimProfile(currentUser) ? ['createUser'] : []),
    /*
     * If the user opted to create a token, define a tx to create the token.
     */
    ...(tokenChoice === 'create' ? ['createToken'] : []),
    /*
     * Always create the following transactions..
     */
    'createColony',
    'createLabel',
    /*
     * If the user opted to create a token, define txs to manage the token.
     */
    ...(tokenChoice === 'create'
      ? ['deployTokenAuthority', 'setTokenAuthority']
      : []),
    /*
     * Always create the following transactions.
     */
    'deployOldRoles',
    'setOldRolesRole',
    'deployOneTx',
    'setOneTxRole',
  ]);
  const {
    createColony,
    createLabel,
    createToken,
    createUser,
    deployOldRoles,
    deployOneTx,
    deployTokenAuthority,
    setOldRolesRole,
    setOneTxRole,
    setTokenAuthority,
  } = channels;

  const createGroupedTransaction = (
    { id, index }: $Values<typeof channels>,
    config: TxConfig,
  ) =>
    fork(createTransaction, id, {
      ...config,
      group: {
        key: 'createColony',
        id: meta.id,
        index,
      },
    });

  /*
   * Create all transactions for the group.
   */
  try {
    const colonyName = ENS.normalize(givenColonyName);
    const username = ENS.normalize(givenUsername);

    if (createUser) {
      yield createGroupedTransaction(createUser, {
        context: NETWORK_CONTEXT,
        methodName: 'registerUserLabel',
        params: { username },
        ready: false,
      });

      const profileStoreAddress = yield* executeQuery(getProfileStoreAddress, {
        metadata: { walletAddress },
      });
      yield put(
        transactionAddParams(createUser.id, {
          orbitDBPath: profileStoreAddress,
        }),
      );
      yield put(transactionReady(createUser.id));
    }

    if (createToken) {
      yield createGroupedTransaction(createToken, {
        context: NETWORK_CONTEXT,
        methodName: 'createToken',
        params: { name: tokenName, symbol: tokenSymbol, decimals: 18 },
      });
    }

    yield createGroupedTransaction(createColony, {
      context: NETWORK_CONTEXT,
      methodName: 'createColony',
      ready: false,
    });

    yield createGroupedTransaction(createLabel, {
      context: COLONY_CONTEXT,
      methodName: 'registerColonyLabel',
      params: { colonyName },
      ready: false,
    });

    if (createToken) {
      yield createGroupedTransaction(deployTokenAuthority, {
        context: TOKEN_CONTEXT,
        methodName: 'createTokenAuthority',
        params: { allowedToTransfer: [] },
        ready: false,
      });

      yield createGroupedTransaction(setTokenAuthority, {
        context: TOKEN_CONTEXT,
        methodName: 'setAuthority',
        ready: false,
      });
    }

    yield createGroupedTransaction(deployOldRoles, {
      context: COLONY_CONTEXT,
      methodName: 'addExtension',
      params: { contractName: 'OldRoles' },
      ready: false,
    });

    yield createGroupedTransaction(setOldRolesRole, {
      context: COLONY_CONTEXT,
      methodContext: 'setOldRolesRole',
      methodName: 'setRootRole',
      params: { setTo: true },
      ready: false,
    });

    yield createGroupedTransaction(deployOneTx, {
      context: COLONY_CONTEXT,
      methodName: 'addExtension',
      params: { contractName: 'OneTxPayment' },
      ready: false,
    });

    yield createGroupedTransaction(setOneTxRole, {
      context: COLONY_CONTEXT,
      methodContext: 'setOneTxRole',
      methodName: 'setAdminRole',
      params: { setTo: true },
      ready: false,
    });

    /*
     * Wait until all transactions are created.
     */
    yield all(
      Object.keys(channels).map(id =>
        takeFrom(channels[id].channel, ACTIONS.TRANSACTION_CREATED),
      ),
    );

    /*
     * Dispatch a success action; this progresses to next wizard step,
     * where transactions can get processed.
     */
    yield put<Action<typeof ACTIONS.COLONY_CREATE_SUCCESS>>({
      type: ACTIONS.COLONY_CREATE_SUCCESS,
      meta,
      payload: undefined,
    });

    if (createUser) {
      /*
       * If the username is being created, wait for the transaction to succeed
       * before creating the profile store and dispatching a success action.
       */
      yield takeFrom(createUser.channel, ACTIONS.TRANSACTION_SUCCEEDED);

      yield put(transactionLoadRelated(createUser.id, true));

      const { metadataStore, inboxStore } = yield* executeCommand(
        createUserProfile,
        {
          args: { username, walletAddress },
          metadata: { walletAddress },
        },
      );

      yield put(transactionLoadRelated(createUser.id, false));

      yield put<Action<typeof ACTIONS.USERNAME_CREATE_SUCCESS>>({
        type: ACTIONS.USERNAME_CREATE_SUCCESS,
        payload: {
          inboxStoreAddress: inboxStore.address.toString(),
          metadataStoreAddress: metadataStore.address.toString(),
          username,
        },
        meta,
      });
    }

    /*
     * For transactions that rely on the receipt/event data of previous transactions,
     * wait for these transactions to succeed, collect the data, and apply it to
     * the pending transactions.
     */
    let tokenAddress: string;
    if (createToken) {
      ({
        payload: {
          transaction: {
            receipt: { contractAddress: tokenAddress },
          },
        },
      } = yield takeFrom(createToken.channel, ACTIONS.TRANSACTION_SUCCEEDED));
    } else {
      if (!givenTokenAddress) {
        throw new Error('Token address not provided');
      }
      tokenAddress = givenTokenAddress;
    }
    tokenAddress = createAddress(tokenAddress);

    /*
     * Pass through tokenAddress after token creation to the colony creation
     * transaction and wait for it to succeed.
     */
    yield put(transactionAddParams(createColony.id, { tokenAddress }));
    yield put(transactionReady(createColony.id));

    const {
      payload: {
        eventData: { colonyAddress },
      },
    } = yield takeFrom(createColony.channel, ACTIONS.TRANSACTION_SUCCEEDED);

    if (!colonyAddress) {
      return yield putError(
        ACTIONS.COLONY_CREATE_ERROR,
        new Error('Missing colony address'),
        meta,
      );
    }

    yield put(transactionLoadRelated(createColony.id, true));
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
          iconHash: tokenIcon,
          isExternal: tokenChoice === 'select',
          isNative: true,
          name: tokenName,
          symbol: tokenSymbol,
        },
      },
    });

    yield put(transactionLoadRelated(createColony.id, false));

    /*
     * Pass through colonyStore Address after colony store creation to colonyName creation
     */
    yield put(
      transactionAddParams(createLabel.id, {
        orbitDBPath: colonyStore.address.toString(),
      }),
    );

    /*
     * Add a colonyAddress identifier to all pending transactions.
     */
    yield all(
      [
        createLabel,
        deployTokenAuthority,
        setTokenAuthority,
        deployOneTx,
        setOneTxRole,
        deployOldRoles,
        setOldRolesRole,
      ]
        .filter(Boolean)
        .map(({ id }) => put(transactionAddIdentifier(id, colonyAddress))),
    );

    const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);

    /*
     * Create label
     */
    yield put(transactionReady(createLabel.id));
    const {
      payload: {
        transaction: {
          receipt: {
            logs: [, , colonyLabelRegisteredLog],
          },
        },
      },
    } = yield takeFrom(createLabel.channel, ACTIONS.TRANSACTION_SUCCEEDED);
    if (deployTokenAuthority) {
      /*
       * Deploy TokenAuthority
       */
      yield put(
        transactionAddParams(deployTokenAuthority.id, {
          colonyAddress,
          tokenAddress,
        }),
      );
      yield put(transactionReady(deployTokenAuthority.id));
      const {
        payload: {
          transaction: {
            receipt: { contractAddress: tokenAuthorityAddress },
          },
        },
      } = yield takeFrom(
        deployTokenAuthority.channel,
        ACTIONS.TRANSACTION_SUCCEEDED,
      );

      /*
       * Set Token authority (to deployed TokenAuthority)
       */
      yield put(
        transactionAddParams(setTokenAuthority.id, {
          authority: tokenAuthorityAddress,
        }),
      );
      yield put(transactionReady(setTokenAuthority.id));
      yield takeFrom(setTokenAuthority.channel, ACTIONS.TRANSACTION_SUCCEEDED);
    }

    /*
     * Deploy OldRoles
     */
    yield put(transactionReady(deployOldRoles.id));

    const {
      payload: {
        transaction: {
          receipt: {
            logs: [deployOldRolesLog],
          },
        },
      },
    } = yield takeFrom(deployOldRoles.channel, ACTIONS.TRANSACTION_SUCCEEDED);
    const oldRolesAddress = parseExtensionDeployedLog(deployOldRolesLog);

    /*
     * Set OldRoles role
     */
    yield put(
      transactionAddParams(setOldRolesRole.id, {
        address: oldRolesAddress,
      }),
    );
    yield put(transactionReady(setOldRolesRole.id));
    yield takeFrom(setOldRolesRole.channel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Deploy OneTx
     */
    yield put(transactionReady(deployOneTx.id));

    const {
      payload: {
        transaction: {
          receipt: {
            logs: [deployOneTxLog],
          },
        },
      },
    } = yield takeFrom(deployOneTx.channel, ACTIONS.TRANSACTION_SUCCEEDED);
    const oneTxAddress = parseExtensionDeployedLog(deployOneTxLog);

    /*
     * Set OneTx role
     */
    yield put(transactionAddParams(setOneTxRole.id, { address: oneTxAddress }));
    yield put(transactionReady(setOneTxRole.id));
    yield takeFrom(setOneTxRole.channel, ACTIONS.TRANSACTION_SUCCEEDED);

    /*
     * Notification
     */

    // @NOTE Here we actually wanna emit the notification because that's gonna be
    // on the colony founder inbox
    const decoratedLog = yield call(
      decorateLog,
      colonyManager.networkClient,
      colonyLabelRegisteredLog,
    );
    yield putNotification(normalizeTransactionLog(colonyAddress, decoratedLog));

    // Subscribe to the colony last, after successful colony creation
    yield put(subscribeToColony(colonyAddress));
    return null;
  } catch (error) {
    yield putError(ACTIONS.COLONY_CREATE_ERROR, error, meta);
    // For non-transaction errors (where something is probably irreversibly wrong),
    // cancel the saga.
    return null;
  } finally {
    /*
     * Close all transaction channels.
     */
    yield all(
      Object.keys(channels).map(id =>
        call([channels[id].channel, channels[id].channel.close]),
      ),
    );
  }
}

// This function assumes that the founder is calling it
function* hasExternalToken(colonyClient) {
  let isExternal = false;
  try {
    yield call([colonyClient.mintTokens, colonyClient.mintTokens.estimate], {
      amount: new BigNumber(1),
    });
  } catch (caughtError) {
    isExternal = true;
  }
  return isExternal;
}

function* colonyRecover({
  meta,
  payload: { colonyAddress },
}: Action<typeof ACTIONS.COLONY_RECOVER_DB>): Saga<*> {
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  const colonyClient = yield call(
    [colonyManager, colonyManager.getColonyClient],
    colonyAddress,
  );
  try {
    yield put(userPermissionsFetch(colonyAddress));
    const {
      payload: {
        permissions: { isFounder },
      },
    } = yield take(ACTIONS.USER_PERMISSIONS_FETCH_SUCCESS);

    if (!isFounder) throw new Error('Founder permission required');

    const colonyName = yield call(getColonyName, colonyAddress);
    const displayName = `Recovered: ${colonyName}`;

    const {
      tokenClient,
      tokenClient: {
        contract: { address: tokenAddress },
      },
    } = colonyClient;
    const { name, symbol } = yield call([
      tokenClient.getTokenInfo,
      tokenClient.getTokenInfo.call,
    ]);

    const isExternalToken = yield call(hasExternalToken, colonyClient);

    yield* executeCommand(createColonyProfile, {
      metadata: { colonyAddress },
      args: {
        colonyAddress,
        colonyName,
        displayName,
        token: {
          address: tokenAddress,
          isExternal: isExternalToken,
          isNative: true,
          name,
          symbol,
        },
      },
    });

    // After a reload everything should be fine again.
    window.location.reload();
  } catch (caughtError) {
    yield putError(ACTIONS.COLONY_RECOVER_DB_ERROR, caughtError, meta);
  }
}

export default function* colonyCreateSaga(): Saga<void> {
  yield takeEvery(ACTIONS.COLONY_CREATE, colonyCreate);
  yield takeEvery(ACTIONS.COLONY_RECOVER_DB, colonyRecover);
}
