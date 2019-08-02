/* @flow */

import type { Saga } from 'redux-saga';

import { eventChannel } from 'redux-saga';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import nanoid from 'nanoid';

import type { Action } from '~redux';

import { putError, raceError } from '~utils/saga/effects';
import { filterUniqueAction } from '~utils/actions';
import { log } from '~utils/debug';
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
    filterUniqueAction(id, ACTIONS.IPFS_DATA_UPLOAD_SUCCESS),
    filterUniqueAction(id, ACTIONS.IPFS_DATA_UPLOAD_ERROR),
  );

  if (error) {
    throw new Error(error);
  }

  return ipfsHash;
}

function* ipfsDataUpload({
  meta,
  payload: { ipfsData },
}: Action<typeof ACTIONS.IPFS_DATA_UPLOAD>): Saga<*> {
  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

    const ipfsHash = yield call([ipfsNode, ipfsNode.addString], ipfsData);

    yield put<Action<typeof ACTIONS.IPFS_DATA_UPLOAD_SUCCESS>>({
      type: ACTIONS.IPFS_DATA_UPLOAD_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    return yield putError(ACTIONS.IPFS_DATA_UPLOAD_ERROR, error, meta);
  }
  return null;
}

function* ipfsDataFetch({
  meta,
  payload: { ipfsHash },
}: Action<typeof ACTIONS.IPFS_DATA_FETCH>): Saga<*> {
  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);
    const ipfsData = yield call([ipfsNode, ipfsNode.getString], ipfsHash);

    yield put<Action<typeof ACTIONS.IPFS_DATA_FETCH_SUCCESS>>({
      type: ACTIONS.IPFS_DATA_FETCH_SUCCESS,
      meta,
      payload: { ipfsHash, ipfsData },
    });
  } catch (error) {
    return yield putError(ACTIONS.IPFS_DATA_FETCH_ERROR, error, meta);
  }
  return null;
}

function* ipfsStatsSubStart(): Saga<*> {
  let channel;
  try {
    const ipfsNode = yield* getContext(CONTEXT.IPFS_NODE);

    channel = eventChannel(emitter => {
      let timeout;
      const listener = async () => {
        try {
          const {
            _ipfs,
            pinner: { _pinnerIds },
            pinner,
          } = ipfsNode;
          // const ping = await _ipfs.ping('STAR_SERVER');
          const ping = 5;
          const pinnerBusy = pinner.busy;
          const pinners = Array.from(_pinnerIds);
          const swarmPeers = await _ipfs.swarm.peers();
          const pubsubPeers = await _ipfs.pubsub.peers();
          emitter({
            ping,
            pinners,
            pinnerBusy,
            swarmPeers,
            pubsubPeers,
          });
        } catch (caughtError) {
          log.warn(caughtError);
        } finally {
          timeout = setTimeout(listener, 5000);
        }
      };
      listener();

      return () => clearTimeout(timeout);
    });

    yield fork(function* stopSubscription() {
      yield take(ACTIONS.IPFS_STATS_SUB_STOP);
      if (channel) channel.close();
    });

    while (true) {
      const action = yield take(channel);
      yield put({
        type: ACTIONS.IPFS_STATS_SUB_EVENT,
        payload: action,
      });
    }
  } catch (caughtError) {
    return yield putError(ACTIONS.IPFS_STATS_SUB_ERROR, caughtError);
  } finally {
    if (channel) channel.close();
  }
}

export default function* ipfsSagas(): Saga<void> {
  yield takeEvery(ACTIONS.IPFS_DATA_UPLOAD, ipfsDataUpload);
  yield takeEvery(ACTIONS.IPFS_DATA_FETCH, ipfsDataFetch);
  yield takeEvery(ACTIONS.IPFS_STATS_SUB_START, ipfsStatsSubStart);
}
