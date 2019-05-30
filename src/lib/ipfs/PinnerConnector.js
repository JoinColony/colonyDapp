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

const PIN_ACTIONS = {
  REPLICATE: 'REPLICATE',
  HAVE_HEADS: 'HAVE_HEADS',
  PIN_HASH: 'PIN_HASH',
};

const EVENTS = {
  CONNECTED: 'CONNECTED',
};

class PinnerConnector {
  _events: EventEmitter;

  _id: string;

  _ipfs: IPFS;

  _openConnections: number;

  _outstandingPubsubMessages: Array<PinnerAction>;

  // Can be an array in the future
  _pinnerId: string;

  _readyPromise: ?Promise<void>;

  _replicationRequests: Map<string, ReplicationRequest>;

  _room: string;

  _roomMonitor: PeerMonitor;

  online: boolean;

  constructor(ipfs: IPFS, room: string, pinnerId: string) {
    this._ipfs = ipfs;
    if (!this._ipfs.pubsub) {
      throw new Error("This IPFS instance doesn't support pubsub");
    }

    this._events = new EventEmitter();
    this._room = room;
    this._pinnerId = pinnerId;
    this.online = false;
    this._outstandingPubsubMessages = [];
    this._openConnections = 0;
    this._replicationRequests = new Map();
  }

  _handlePinnerMessage = (message: PubsubMessage) => {
    // Don't process anything that doesn't come from a pinner
    if (!this.isPinner(message.from)) return;
    try {
      const { type, to, payload } = JSON.parse(message.data);

      switch (type) {
        case PIN_ACTIONS.HAVE_HEADS: {
          this._events.emit(PIN_ACTIONS.HAVE_HEADS, { to, payload });
          return;
        }
        default:
      }
    } catch (caughtError) {
      log.error(new Error(`Could not parse pinner message: ${message.data}`));
    }
  };

  get busy() {
    return !!this._openConnections || !!this._outstandingPubsubMessages.length;
  }

  _handleNewPeer(peer: string) {
    /**
     * @todo Maintain multiple pinner IDs for the PinnerConnector
     */
    if (this.isPinner(peer)) {
      this._setReady(peer);
    }
  }

  _handleLeavePeer(peer: string) {
    // When we have multiple pinner IDs, we are offline when the
    // last one leaves.
    if (this.isPinner(peer)) {
      this.online = false;
    }
  }

  _flushPinnerMessages() {
    this._outstandingPubsubMessages.forEach(message =>
      this._publishAction(message),
    );
    this._outstandingPubsubMessages = [];
  }

  _publishAction(action: PinnerAction) {
    if (this.online) {
      this._ipfs.pubsub
        .publish(this._room, Buffer.from(JSON.stringify(action)))
        // pubsub.publish returns a promise, so when calling it synchronously, we have to handle errors here
        .catch(console.warn);
    } else {
      this._outstandingPubsubMessages.push(action);
    }
  }

  _setReady(peer: string) {
    this.online = true;
    this._readyPromise = undefined;
    this._events.emit(EVENTS.CONNECTED, peer);
    this._flushPinnerMessages();
  }

  isPinner(peer: string) {
    return peer === this._pinnerId;
  }

  async init() {
    if (this._id) throw new Error('Unable to re-initialize PinnerConnector');

    const { id } = await this._ipfs.id();
    this._id = id;

    await this._ipfs.pubsub.subscribe(this._room, this._handlePinnerMessage);

    this._roomMonitor = new PeerMonitor(this._ipfs.pubsub, this._room);
    this._roomMonitor.on('join', this._handleNewPeer.bind(this));
    this._roomMonitor.on('leave', this._handleLeavePeer.bind(this));
    this._roomMonitor.on('error', log);
  }

  async ready() {
    if (this.online) return true;
    if (this._readyPromise) return this._readyPromise;
    this._readyPromise = pEvent(this._events, EVENTS.CONNECTED, {
      timeout: PINNER_CONNECT_TIMEOUT,
    }).then(() => true);
    return this._readyPromise;
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
      await this.ready();
    } catch (caughtError) {
      log.warn('Could not request replication. Pinner is offline.');
      return 0;
    }

    const newRequest = {
      isPending: true,
      promise: pEvent(this._events, PIN_ACTIONS.HAVE_HEADS, {
        timeout: PINNER_HAVE_HEADS_TIMEOUT,
        filter: ({ to }) => to === address,
      }).then(res => {
        newRequest.isPending = false;
        return res;
      }),
    };

    this._replicationRequests.set(address, newRequest);
    this._publishAction({
      type: PIN_ACTIONS.REPLICATE,
      payload: { address },
    });
    const {
      payload: { count },
    } = await newRequest.promise;
    return count;
  }

  async pinHash(ipfsHash: string) {
    this._publishAction({
      type: PIN_ACTIONS.PIN_HASH,
      payload: { ipfsHash },
    });
    if (!isDev) {
      // Just in case we use infura as well to pin stuff
      try {
        await fetch(
          `https://ipfs.infura.io:5001/api/v0/pin/add?arg=/ipfs/${ipfsHash}`,
        );
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export default PinnerConnector;
