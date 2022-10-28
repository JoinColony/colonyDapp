import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../../core/sagas';
import { transactionReady } from '../../../core/actionCreators';

import { refreshExtension } from '../utils';

export function* colonyExtensionUninstall({
  meta: { id: metaId },
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.EXTENSION_UNINSTALL>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'unistallExtensions';
    const {
      uninstallExtensionTx: uninstallExtension,
    } = yield createTransactionChannels(metaId, ['uninstallExtensionTx']);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    yield createGroupTransaction(uninstallExtension, {
      context: ClientType.ColonyClient,
      methodName: 'uninstallExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId)],
      ready: false,
    });

    yield takeFrom(uninstallExtension.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(uninstallExtension.id));
    yield takeFrom(
      uninstallExtension.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    yield call(refreshExtension, colonyAddress, extensionId);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_UNINSTALL_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionUninstallSaga() {
  yield takeEvery(ActionTypes.EXTENSION_UNINSTALL, colonyExtensionUninstall);
}
