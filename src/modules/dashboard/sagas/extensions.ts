import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  // ColonyRole,
  getExtensionHash,
  // ROOT_DOMAIN_ID,
} from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import extensionData from '~data/staticData/extensionData';
import { ContextModule, TEMP_getContext } from '~context/index';

import { createTransaction, getTxChannel } from '../../core/sagas';

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
}

function* colonyExtensionInstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), 1],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_INSTALL_ERROR,
      error,
      meta,
    );
  } finally {
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

  if (!extension) {
    throw new Error(`Extension with id ${extensionId} does not exist!`);
  }
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

    const {
      // address,
      details: { initialized, missingPermissions },
    } = data.colonyExtension;

    if (!initialized && extension.initializationParams) {
      const initParams = extension.initializationParams.map(
        ({ paramName }) => payload[paramName],
      );
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
      // @TODO get the bytes32roles somehow
      // yield fork(createTransaction, setPermissionChannelName, {
      //   context: ClientType.ColonyClient,
      //   methodName: 'setUserRolesWithProofs',
      //   identifier: colonyAddress,
      //   params: [address, ROOT_DOMAIN_ID, bytes32Roles],
      //   group: {
      //     key: 'enableExtension',
      //     id: meta.id,
      //     index: 1,
      //   },
      // });
    }

    yield takeFrom(setPermissionChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_INSTALL_ERROR,
      error,
      meta,
    );
  } finally {
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

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_DEPRECATE_ERROR,
      error,
      meta,
    );
  } finally {
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
      params: [getExtensionHash(extensionId), true],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_UNINSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_UNINSTALL_ERROR,
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
}
