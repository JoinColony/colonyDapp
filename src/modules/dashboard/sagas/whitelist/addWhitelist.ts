import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

function* addWhitelistAction({
  payload: { colonyAddress, whiteListAddresses, annotationMessage },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.WHITELIST_ADD>) {
  const txChannel = yield call(getTxChannel, metaId);

  try {
    const batchKey = 'addWhitelistAction';
    const {
      addWhitelistAction: addWhitelist,
    } = yield createTransactionChannels(metaId, ['addWhitelistAction']);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    yield createGroupTransaction(addWhitelist, {
      context: ClientType.ColonyClient,
      methodName: 'addWhitelistAction',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      addWhitelist.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield put(transactionPending(addWhitelist.id));

    /*
     * Upload whitelist & annotation metadata to IPFS
     */
    let colonyMetadataIpfsHash = null;
    colonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        whiteListAddresses,
        annotationMessage,
      }),
    );

    yield put(
      transactionAddParams(addWhitelist.id, [txHash, colonyMetadataIpfsHash]),
    );

    yield put(transactionReady(addWhitelist.id));

    yield takeFrom(addWhitelist.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.WHITELIST_ADD_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.WHITELIST_ADD_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* addWhitelistActionSaga() {
  yield takeEvery(ActionTypes.WHITELIST_ADD, addWhitelistAction);
}
