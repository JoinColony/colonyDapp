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
    const ddb = yield* getContext(CONTEXT.DDB_INSTANCE);
    const {
      _ipfs,
      pinner: { _pinnerIds },
      pinner,
    } = ipfsNode;
    const { _stores } = ddb;

    channel = eventChannel(emitter => {
      let timeout;
      const intervalListener = async () => {
        try {
          const pinnerBusy = pinner.busy;
          const pinners = Array.from(_pinnerIds);
          const swarmPeers = await _ipfs.swarm.peers();
          const pubsubPeers = await _ipfs.pubsub.peers();
          const pingAnswers = await Promise.all(
            pinners.map(id => _ipfs.ping(id, { count: 1 })),
          );
          const openStores = _stores.size;
          const busyStores = Array.from(_stores.values())
            .filter(store => store.busy)
            .map(store => store.address.toString());
          const ping =
            pingAnswers.reduce((sum, current) => sum + current[1].time, 0) /
            pingAnswers.length;
          emitter({
            busyStores,
            openStores,
            ping,
            pinners,
            pinnerBusy,
            swarmPeers: swarmPeers.map(peer => peer.addr.toString()),
            pubsubPeers,
          });
        } catch (caughtError) {
          log.warn(caughtError);
        } finally {
          timeout = setTimeout(intervalListener, 5000);
        }
      };

      const errorListener = (scope: string, error: Error) => {
        emitter({
          scope,
          error,
        });
      };

      pinner.events.addListener('error', errorListener);
      intervalListener();

      return () => {
        clearTimeout(timeout);
        pinner.events.removeListener('error', errorListener);
      };
    });

    yield fork(function* stopSubscription() {
      yield take(ACTIONS.CONNECTION_STATS_SUB_STOP);
      if (channel) channel.close();
    });

    while (true) {
      const payload = yield take(channel);
      if (payload.error) {
        yield putError(ACTIONS.CONNECTION_STATS_SUB_ERROR, payload.error, {
          scope: payload.scope || 'channel',
        });
      } else {
        yield put({
          type: ACTIONS.CONNECTION_STATS_SUB_EVENT,
          payload,
        });
      }
    }
  } catch (caughtError) {
    return yield putError(ACTIONS.CONNECTION_STATS_SUB_ERROR, caughtError, {
      scope: 'default',
    });
  } finally {
    if (channel) channel.close();
  }
}

export default function* connectionSagas(): Saga<void> {
  yield takeEvery(ACTIONS.CONNECTION_STATS_SUB_START, connectionStatsSubStart);
}
