// eslint-disable-next-line import/no-extraneous-dependencies
import EventEmitter from 'events';
import PeerMonitor from 'ipfs-pubsub-peer-monitor';
import IPFS from 'ipfs';
import pEvent from 'p-event';

import { isDev, log } from '../../utils/debug';

import { PinnerAction } from './types';

type ReplicationRequest = {
  promise: Promise<PinnerAction>;
  isPending: boolean;
};

const PINNER_CONNECT_TIMEOUT = 20 * 1000; // This is just a number I came up with randomly. Adjust if necessary
const PINNER_HAVE_HEADS_TIMEOUT = 30 * 1000; // Seems necessary to have this higher

enum ClientActions {
  REPLICATE = 'REPLICATE',
  PIN_HASH = 'PIN_HASH',
  ANNOUNCE_CLIENT = 'ANNOUNCE_CLIENT',
}

enum PinnerActions {
  ANNOUNCE_PINNER = 'ANNOUNCE_PINNER',
  HAVE_HEADS = 'HAVE_HEADS',
}

class PinnerConnector {
  _id?: string;

  _ipfs: IPFS;

  _outstandingPubsubMessages: PinnerAction[];

  _pinnerIds: Set<string>;

  _readyPromise?: Promise<boolean> | void;

  _replicationRequests: Map<string, ReplicationRequest>;

  _room: string;

  _roomMonitor: PeerMonitor;

  events: EventEmitter;

  static async getHeadsCount(
    promise: Promise<{ payload: { count: number } } | null>,
  ): Promise<number> {
    const resolved = await promise;
    return resolved ? resolved.payload.count : 0;
  }

  constructor(ipfs: IPFS, room: string) {
    this._ipfs = ipfs;
    if (!this._ipfs.pubsub) {
      throw new Error("This IPFS instance doesn't support pubsub");
    }

    this.events = new EventEmitter();

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

    this._readyPromise = pEvent(this.events, PinnerActions.ANNOUNCE_PINNER, {
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
    this._publishAction({
      type: ClientActions.ANNOUNCE_CLIENT,
      payload: { id },
    });

    this._roomMonitor = new PeerMonitor(this._ipfs.pubsub, this._room);
    this._roomMonitor.on('leave', this._handleLeavePeer.bind(this));
    this._roomMonitor.on('error', log);
  }

  async disconnect() {
    await this._ipfs.pubsub.unsubscribe(this._room, this._handlePinnerMessage);
    this._roomMonitor.stop();
  }

  async requestReplication(address: string) {
    const startRequesting = Date.now();
    log.verbose(`Requesting replication for store ${address}`);

    const request = this._replicationRequests.get(address);
    if (request && request.isPending) {
      return PinnerConnector.getHeadsCount(request.promise as any);
    }

    try {
      log.verbose('Waiting for pinner to be ready...');
      await this.ready;
      log.verbose(`Pinner is ready now in ${Date.now() - startRequesting} ms!`);
    } catch (caughtError) {
      this.events.emit('error', 'pinner:replication', caughtError);
      log.warn('Could not request replication; not connected to any pinners.');
      return 0;
    }

    const newRequest = {
      isPending: true,
      promise: pEvent(this.events, PinnerActions.HAVE_HEADS, {
        timeout: PINNER_HAVE_HEADS_TIMEOUT,
        filter: ({ to }) => to === address,
      })
        .then(res => {
          newRequest.isPending = false;
          return res;
        })
        .catch(caughtError => {
          // Let's just try again, shall we?
          this.requestReplication(address).catch(log.warn);
          this.events.emit('error', 'pinner:replication', caughtError);
          log.warn('Could not replicate, pinner did not respond in time.');
        }),
    };

    this._replicationRequests.set(address, newRequest);
    this._publishAction({
      type: ClientActions.REPLICATE,
      payload: { address },
    });
    return PinnerConnector.getHeadsCount(newRequest.promise);
  }

  async pinHash(ipfsHash: string) {
    this._publishAction({
      type: ClientActions.PIN_HASH,
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

  _handlePinnerMessage = (message: IPFS.PubsubMessage): void => {
    try {
      const parsed = JSON.parse(message.data.toString());

      // The message could be anything; we're only interested in those
      // with data that follows our format.
      if (typeof parsed !== 'object') return;
      const { type, to, payload } = parsed;

      // Emit actions from the pinner and ignore everything else.
      if (PinnerActions[type]) {
        this.events.emit(type, { to, payload });
      }
    } catch (caughtError) {
      log.error(new Error('Could not parse pinner message'));
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
        .publish(this._room, Buffer.from(stringifiedAction)) // pubsub.publish returns a promise, so when calling it synchronously, we have to handle errors here
        .catch(log.warn);
    } else {
      this._outstandingPubsubMessages.push(action);
    }
  }

  _listenForAnnouncements() {
    this.events.on(PinnerActions.ANNOUNCE_PINNER, ({ payload: { ipfsId } }) => {
      if (this._pinnerIds.has(ipfsId)) return;

      this._pinnerIds.add(ipfsId);
      this._flushPinnerMessages();
    });
  }

  _isPinner(peer: string) {
    return this._pinnerIds.has(peer);
  }
}

export default PinnerConnector;
