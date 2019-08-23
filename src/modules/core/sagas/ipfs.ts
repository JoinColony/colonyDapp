import { call, put, takeEvery } from 'redux-saga/effects';
import nanoid from 'nanoid';

import { Action, ActionTypes, AllActions } from '~redux/index';

import { putError, raceError } from '~utils/saga/effects';
import { filterUniqueAction } from '~utils/actions';
import { Context, getContext } from '~context/index';

import { uploadIpfsData } from '../actionCreators';

export function* ipfsUpload(data: string) {
  const id = nanoid();
  yield put(uploadIpfsData(data, id));

  const [
    {
      payload: { ipfsHash },
    },
    error,
  ] = yield raceError(
    filterUniqueAction(id, ActionTypes.IPFS_DATA_UPLOAD_SUCCESS),
    filterUniqueAction(id, ActionTypes.IPFS_DATA_UPLOAD_ERROR),
  );

  if (error) {
    throw new Error(error);
  }

  return ipfsHash;
}

function* ipfsDataUpload({
  meta,
  payload: { ipfsData },
}: Action<ActionTypes.IPFS_DATA_UPLOAD>) {
  try {
    const ipfsNode = yield getContext(Context.IPFS_NODE);

    const ipfsHash = yield call([ipfsNode, ipfsNode.addString], ipfsData);

    yield put<AllActions>({
      type: ActionTypes.IPFS_DATA_UPLOAD_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    return yield putError(ActionTypes.IPFS_DATA_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* ipfsDataFetch({
  meta,
  payload: { ipfsHash },
}: Action<ActionTypes.IPFS_DATA_FETCH>) {
  try {
    const ipfsNode = yield getContext(Context.IPFS_NODE);
    const ipfsData = yield call([ipfsNode, ipfsNode.getString], ipfsHash);

    yield put<AllActions>({
      type: ActionTypes.IPFS_DATA_FETCH_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    return yield putError(ActionTypes.IPFS_DATA_FETCH_ERROR, error, meta);
  }
  return null;
}

export default function* ipfsSagas() {
  yield takeEvery(ActionTypes.IPFS_DATA_UPLOAD, ipfsDataUpload);
  yield takeEvery(ActionTypes.IPFS_DATA_FETCH, ipfsDataFetch);
}
