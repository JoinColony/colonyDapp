/* @flow */

import type { Saga } from 'redux-saga';

import { eventChannel } from 'redux-saga';
import { fork, put, take, takeEvery } from 'redux-saga/effects';

import { putError } from '~utils/saga/effects';
import { log } from '~utils/debug';
import { CONTEXT, getContext } from '~context';
import { ACTIONS } from '~redux';

function* connectionStatsSubStart(): Saga<*> {
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
            swarmPeers: swarmPeers.map(peer => peer.addr.toString()),
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
      yield take(ACTIONS.CONNECTION_STATS_SUB_STOP);
      if (channel) channel.close();
    });

    while (true) {
      const event = yield take(channel);
      yield put({
        type: ACTIONS.CONNECTION_STATS_SUB_EVENT,
        payload: event,
      });
    }
  } catch (caughtError) {
    return yield putError(ACTIONS.CONNECTION_STATS_SUB_ERROR, caughtError);
  } finally {
    if (channel) channel.close();
  }
}

export default function* connectionSagas(): Saga<void> {
  yield takeEvery(ACTIONS.CONNECTION_STATS_SUB_START, connectionStatsSubStart);
}
