import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  getExtensionHash,
  ROOT_DOMAIN_ID,
  Extension,
} from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
  ColonyExtensionsQuery,
  ColonyExtensionsQueryVariables,
  ColonyExtensionsDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  NetworkExtensionVersionQuery,
  NetworkExtensionVersionQueryVariables,
  NetworkExtensionVersionDocument,
} from '~data/index';
import extensionData, { PolicyType } from '~data/staticData/extensionData';
import {
  ContextModule,
  TEMP_getContext,
  TEMP_setContext,
} from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';
import { intArrayToBytes32 } from '~utils/web3';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';

function* refreshExtension(colonyAddress: string, extensionId: string) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  yield apolloClient.query<ColonyExtensionQuery, ColonyExtensionQueryVariables>(
    {
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
      fetchPolicy: 'network-only',
    },
  );
  yield apolloClient.query<
    ColonyExtensionsQuery,
    ColonyExtensionsQueryVariables
  >({
    query: ColonyExtensionsDocument,
    variables: {
      address: colonyAddress,
    },
    fetchPolicy: 'network-only',
  });
  yield apolloClient.query<ProcessedColonyQuery, ProcessedColonyQueryVariables>(
    {
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    },
  );
}

function* colonyExtensionInstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  try {
    /*
     * Get the latest extension version that's deployed to the network
     */
    const {
      data: { networkExtensionVersion },
    } = yield apolloClient.query<
      NetworkExtensionVersionQuery,
      NetworkExtensionVersionQueryVariables
    >({
      query: NetworkExtensionVersionDocument,
      variables: {
        extensionId,
      },
      fetchPolicy: 'network-only',
    });

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), networkExtensionVersion],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_INSTALL_ERROR,
      error,
      meta,
    );
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

function* colonyExtensionEnable({
  meta,
  payload: { colonyAddress, extensionId, ...payload },
}: Action<ActionTypes.COLONY_EXTENSION_ENABLE>) {
  const extension = extensionData[extensionId];
  const initChannelName = `${meta.id}-initialise`;
  const setPermissionChannelName = `${meta.id}-setUserRoles`;
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }

  const key = `${colonyAddress}-${extensionId}`;
  // Remove old extensions client if exist
  colonyManager.extensionClients.delete(key);
  TEMP_setContext(ContextModule.ColonyManager, colonyManager);

  const initChannel = yield call(getTxChannel, initChannelName);
  const setPermissionChannel = yield call(
    getTxChannel,
    setPermissionChannelName,
  );
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  try {
    const { data } = yield apolloClient.query<
      ColonyExtensionQuery,
      ColonyExtensionQueryVariables
    >({
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
    });

    if (!data) {
      throw new Error('Extension not installed');
    }

    /*
     * Upload whitelist policy to IPFS
     */
    let agreementHash = '';
    if (
      extensionId === Extension.Whitelist &&
      payload?.policy !== PolicyType.KycOnly
    ) {
      agreementHash = yield call(
        ipfsUpload,
        JSON.stringify({
          agreement: payload.agreement,
        }),
      );
    }
    const {
      address,
      details: { initialized, missingPermissions },
    } = data.colonyExtension;

    if (!initialized && extension.initializationParams) {
      let initParams = [] as any[];

      if (extensionId === Extension.Whitelist) {
        initParams = [
          payload?.policy !== PolicyType.AgreementOnly,
          agreementHash,
        ];
      } else {
        initParams = extension.initializationParams.map(({ paramName }) => {
          if (typeof payload[paramName] === 'number') {
            return bigNumberify(String(payload[paramName]));
          }
          return payload[paramName];
        });
      }

      yield fork(createTransaction, initChannelName, {
        context: `${extensionId}Client`,
        methodName: 'initialise',
        identifier: colonyAddress,
        params: initParams,
        group: {
          key: 'enableExtension',
          id: meta.id,
          index: 0,
        },
      });
    }

    if (missingPermissions.length) {
      const bytes32Roles = intArrayToBytes32(missingPermissions);
      yield fork(createTransaction, setPermissionChannelName, {
        context: ClientType.ColonyClient,
        methodName: 'setUserRolesWithProofs',
        identifier: colonyAddress,
        params: [address, ROOT_DOMAIN_ID, bytes32Roles],
        group: {
          key: 'enableExtension',
          id: meta.id,
          index: 1,
        },
      });
    }

    yield waitForTxResult(initChannel);
    yield waitForTxResult(setPermissionChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_ENABLE_ERROR,
      error,
      meta,
    );
  } finally {
    const colonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const client = yield colonyClient.getExtensionClient(extensionId);
    if (client) {
      colonyManager.extensionClients.set(key, client);
      TEMP_setContext(ContextModule.ColonyManager, colonyManager);
    }
    yield call(refreshExtension, colonyAddress, extensionId);
    initChannel.close();
    setPermissionChannel.close();
  }
  return null;
}

function* colonyExtensionDeprecate({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_DEPRECATE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'deprecateExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), true],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_DEPRECATE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_DEPRECATE_ERROR,
      error,
      meta,
    );
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

function* colonyExtensionUninstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_UNINSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'uninstallExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId)],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_UNINSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR,
      error,
      meta,
    );
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

function* colonyExtensionUpgrade({
  meta,
  payload: { colonyAddress, extensionId, version },
}: Action<ActionTypes.COLONY_EXTENSION_UPGRADE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'upgradeExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), version],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_UPGRADE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_UPGRADE_ERROR,
      error,
      meta,
    );
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

function* removeFromWhitelist({
  meta,
  payload: { userAddress, colonyAddress },
}: Action<ActionTypes.REMOVE_FROM_WHITELIST>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.WhitelistClient,
      methodName: 'approveUsers',
      identifier: colonyAddress,
      params: [[userAddress], false],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.REMOVE_FROM_WHITELIST_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(
      ActionTypes.REMOVE_FROM_WHITELIST_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_INSTALL, colonyExtensionInstall);
  yield takeEvery(ActionTypes.COLONY_EXTENSION_ENABLE, colonyExtensionEnable);
  yield takeEvery(
    ActionTypes.COLONY_EXTENSION_DEPRECATE,
    colonyExtensionDeprecate,
  );
  yield takeEvery(
    ActionTypes.COLONY_EXTENSION_UNINSTALL,
    colonyExtensionUninstall,
  );
  yield takeEvery(ActionTypes.COLONY_EXTENSION_UPGRADE, colonyExtensionUpgrade);
  yield takeEvery(ActionTypes.REMOVE_FROM_WHITELIST, removeFromWhitelist);
}
