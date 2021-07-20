import { call, fork, put } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../../../core/sagas';

import { refreshExtension } from '../utils';

export function* colonyExtensionDeprecate({
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
