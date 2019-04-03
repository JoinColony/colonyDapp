/* @flow */

import type { Saga } from 'redux-saga';

import { call, put, takeEvery } from 'redux-saga/effects';
import nanoid from 'nanoid';

import type { Action } from '~redux';

import { putError, raceError } from '~utils/saga/effects';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

import { uploadIpfsData } from '../actionCreators';

export function* ipfsUpload(data: string): Saga<string> {
  const id = nanoid();
  yield put(uploadIpfsData(data, id));
  const [
    {
      payload: { ipfsHash },
    },
    error,
  ] = yield raceError(
    action =>
      action.type === ACTIONS.IPFS_DATA_UPLOAD_SUCCESS && action.meta.id === id,
    action =>
      action.type === ACTIONS.IPFS_DATA_UPLOAD_ERROR && action.meta.id === id,
  );
  if (error) throw new Error(error);
  return ipfsHash;
}

function* ipfsDataUpload({
  meta,
  payload: { ipfsData },
}: Action<typeof ACTIONS.IPFS_DATA_UPLOAD>): Saga<void> {
  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

    const ipfsHash = yield call([ipfsNode, ipfsNode.addString], ipfsData);

    yield put<Action<typeof ACTIONS.IPFS_DATA_UPLOAD_SUCCESS>>({
      type: ACTIONS.IPFS_DATA_UPLOAD_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    yield putError(ACTIONS.IPFS_DATA_UPLOAD_ERROR, error, meta);
  }
}

function* ipfsDataFetch({
  meta,
  payload: { ipfsHash },
}: Action<typeof ACTIONS.IPFS_DATA_FETCH>): Saga<void> {
  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
    const ipfsData = yield call([ipfsNode, ipfsNode.getString], ipfsHash);

    yield put<Action<typeof ACTIONS.IPFS_DATA_FETCH_SUCCESS>>({
      type: ACTIONS.IPFS_DATA_FETCH_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    yield putError(ACTIONS.IPFS_DATA_FETCH_ERROR, error, meta);
  }
}

export default function* ipfsSagas(): Saga<void> {
  yield takeEvery(ACTIONS.IPFS_DATA_UPLOAD, ipfsDataUpload);
  yield takeEvery(ACTIONS.IPFS_DATA_FETCH, ipfsDataFetch);
}
