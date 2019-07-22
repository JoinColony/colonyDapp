/* @flow */

import EventEmitter from 'events';
import PeerMonitor from 'ipfs-pubsub-peer-monitor';
import IPFS from 'ipfs';
import pEvent from 'p-event';

import { isDev, log } from '../../utils/debug';

import type { PinnerAction } from './types';

type PubsubMessage = {
  from: string,
  topicIDs: Array<string>,
  data: string,
};

type ReplicationRequest = {
  promise: Promise<PinnerAction>,
  isPending: boolean,
};

const PINNER_CONNECT_TIMEOUT = 20 * 1000; // This is just a number I came up with randomly. Adjust if necessary
const PINNER_HAVE_HEADS_TIMEOUT = 30 * 1000; // Seems necessary to have this higher

const CLIENT_ACTIONS = {
  REPLICATE: 'REPLICATE',
  PIN_HASH: 'PIN_HASH',
};

const PINNER_ACTIONS = {
  ANNOUNCE_PINNER: 'ANNOUNCE_PINNER',
  HAVE_HEADS: 'HAVE_HEADS',
};

class PinnerConnector {
  _events: EventEmitter;

  _id: string;

  _ipfs: IPFS;

  _outstandingPubsubMessages: Array<PinnerAction>;

  _pinnerIds: Set<string>;

  _readyPromise: ?Promise<void>;

  _replicationRequests: Map<string, ReplicationRequest>;

  _room: string;

  _roomMonitor: PeerMonitor;

  constructor(ipfs: IPFS, room: string) {
    this._ipfs = ipfs;
    if (!this._ipfs.pubsub) {
      throw new Error("This IPFS instance doesn't support pubsub");
    }

    this._events = new EventEmitter();
    this._room = room;
    this._pinnerIds = new Set();
    this._outstandingPubsubMessages = [];
    this._replicationRequests = new Map();
    this._listenForAnnouncements();
  }

  get busy() {
    const hasPendingRequests = Array.from(
      this._replicationRequests.values(),
    ).some(req => req.isPending);
    return !!this._outstandingPubsubMessages.length || hasPendingRequests;
  }

  get connectedToPinner() {
    return this._pinnerIds.size > 0;
  }

  get readyPromise() {
    if (this._readyPromise) return this._readyPromise;

    this._readyPromise = pEvent(this._events, PINNER_ACTIONS.ANNOUNCE_PINNER, {
      timeout: PINNER_CONNECT_TIMEOUT,
    })
      .then(() => true)
      .finally(() => {
        this._readyPromise = undefined;
      });
    this._readyPromise.catch(error =>
      log.warn(
        'Could not request replication; not connected to any pinners.',
        error,
      ),
    );
    return this._readyPromise;
  }

  get ready() {
    return this.connectedToPinner || this.readyPromise;
  }

  async init() {
    if (this._id) throw new Error('Unable to re-initialize PinnerConnector');

    const { id } = await this._ipfs.id();
    this._id = id;

    await this._ipfs.pubsub.subscribe(this._room, this._handlePinnerMessage);

    this._roomMonitor = new PeerMonitor(this._ipfs.pubsub, this._room);
    this._roomMonitor.on('leave', this._handleLeavePeer.bind(this));
    this._roomMonitor.on('error', log);
  }

  async disconnect() {
    await this._ipfs.pubsub.unsubscribe(this._room, this._handlePinnerMessage);
    this._roomMonitor.stop();
  }

  async requestReplication(address: string) {
    log.verbose(`Requesting replication for store ${address}`);
    const request = this._replicationRequests.get(address);
    if (request && request.isPending) {
      const {
        payload: { count },
      } = await request.promise;
      return count;
    }
    try {
      log.verbose('Waiting for pinner to be ready...');
      await this.ready;
      log.verbose('Pinner is ready now!');
    } catch (caughtError) {
      log.warn('Could not request replication; not connected to any pinners.');
      return 0;
    }

    const newRequest = {
      isPending: true,
      promise: pEvent(this._events, PINNER_ACTIONS.HAVE_HEADS, {
        timeout: PINNER_HAVE_HEADS_TIMEOUT,
        filter: ({ to }) => to === address,
      }).then(res => {
        newRequest.isPending = false;
        return res;
      }),
    };

    this._replicationRequests.set(address, newRequest);
    this._publishAction({
      type: CLIENT_ACTIONS.REPLICATE,
      payload: { address },
    });
    const {
      payload: { count },
    } = await newRequest.promise;
    return count;
  }

  async pinHash(ipfsHash: string) {
    this._publishAction({
      type: CLIENT_ACTIONS.PIN_HASH,
      payload: { ipfsHash },
    });
    if (!isDev) {
      // Just in case we use infura as well to pin stuff
      try {
        await fetch(
          `https://ipfs.infura.io:5001/api/v0/pin/add?arg=/ipfs/${ipfsHash}`,
        );
      } catch (caughtError) {
        log.error(caughtError);
      }
    }
  }

  _handlePinnerMessage = (message: PubsubMessage) => {
    try {
      const parsed = JSON.parse(message.data);

      // The message could be anything; we're only interested in those
      // with data that follows our format.
      if (typeof parsed !== 'object') return;
      const { type, to, payload } = parsed;

      // Emit actions from the pinner and ignore everything else.
      if (PINNER_ACTIONS[type]) {
        this._events.emit(type, { to, payload });
      }
    } catch (caughtError) {
      log.error(new Error(`Could not parse pinner message: ${message.data}`));
    }
  };

  _handleLeavePeer(peer: string) {
    if (this._isPinner(peer)) {
      this._pinnerIds.delete(peer);
    }
  }

  _flushPinnerMessages() {
    this._outstandingPubsubMessages.forEach(message =>
      this._publishAction(message),
    );
    this._outstandingPubsubMessages = [];
  }

  _publishAction(action: PinnerAction) {
    if (this.connectedToPinner) {
      const stringifiedAction = JSON.stringify(action);
      log.verbose(`Publishing action: ${stringifiedAction}`);
      this._ipfs.pubsub
        .publish(this._room, Buffer.from(stringifiedAction))
        // pubsub.publish returns a promise, so when calling it synchronously, we have to handle errors here
        .catch(log.warn);
    } else {
      this._outstandingPubsubMessages.push(action);
    }
  }

  _listenForAnnouncements() {
    this._events.on(
      PINNER_ACTIONS.ANNOUNCE_PINNER,
      ({ payload: { ipfsId } }) => {
        if (this._pinnerIds.has(ipfsId)) return;

        this._pinnerIds.add(ipfsId);
        this._flushPinnerMessages();
      },
    );
  }

  _isPinner(peer: string) {
    return this._pinnerIds.has(peer);
  }
}

export default PinnerConnector;
