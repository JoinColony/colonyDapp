import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import {
  NetworkExtensionVersionQuery,
  NetworkExtensionVersionQueryVariables,
  NetworkExtensionVersionDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';

import { refreshExtension } from '../utils';

export function* colonyExtensionInstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const { networkClient } = TEMP_getContext(ContextModule.ColonyManager);

  try {
    /*
     * Get the latest extension version that's supported by colonyJS
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
    const [latestExtensionDepoyment] = networkExtensionVersion;

    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [
        getExtensionHash(extensionId),
        latestExtensionDepoyment?.version || 0,
      ],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_INSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_INSTALL_ERROR, error, meta);
  } finally {
    const extensionAddress = yield networkClient.getExtensionInstallation(
      getExtensionHash(extensionId),
      colonyAddress,
    );
    yield call(refreshExtension, colonyAddress, extensionId, extensionAddress);

    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionInstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_INSTALL, colonyExtensionInstall);
}
