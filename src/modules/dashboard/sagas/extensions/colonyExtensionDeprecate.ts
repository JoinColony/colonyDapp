import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';

import { refreshExtension } from '../utils';

function* colonyExtensionDeprecate({
  meta,
  payload: { colonyAddress, extensionId, isToDeprecate },
}: Action<ActionTypes.EXTENSION_DEPRECATE>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'deprecateExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), isToDeprecate],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
      payload: {},
      meta,
    });

    yield waitForTxResult(txChannel);
  } catch (error) {
    return yield putError(ActionTypes.EXTENSION_DEPRECATE_ERROR, error, meta);
  } finally {
    yield call(refreshExtension, colonyAddress, extensionId);

    txChannel.close();
  }
  return null;
}

export default function* colonyExtensionDeprecateSaga() {
  yield takeEvery(ActionTypes.EXTENSION_DEPRECATE, colonyExtensionDeprecate);
}
