/* @flow */

import EventEmitter from 'events';
import PeerMonitor from 'ipfs-pubsub-peer-monitor';
import IPFS from 'ipfs';

import { isDev, log } from '../../utils/debug';
import { raceAgainstTimeout } from '../../utils/async';

import type { PinnerAction } from './types';

type PubsubMessage = {
  from: string,
  topicIDs: Array<string>,
  data: string,
};

const PINNER_CONNECT_TIMEOUT = 20 * 1000; // This is just a number I came up with randomly. Adjust if necessary
const PINNER_HAVE_HEADS_TIMEOUT = 20 * 1000; // Same

const PIN_ACTIONS = {
  PIN_STORE: 'PIN_STORE',
  LOAD_STORE: 'LOAD_STORE',
  HAVE_HEADS: 'HAVE_HEADS',
  PIN_HASH: 'PIN_HASH',
  REPLICATED: 'REPLICATED',
  ACK: 'ACK',
};

class PinnerConnector extends EventEmitter {
  _handlePinnerMessageBound: (message: PubsubMessage) => void;

  _id: string;

  _ipfs: IPFS;

  _openConnections: number;

  _outstandingPubsubMessages: Array<PinnerAction>;

  // Can be an array in the future
  _pinnerId: string;

  _resolveReadyPromise: (boolean => void) | void;

  _room: string;

  _roomMonitor: PeerMonitor;

  online: boolean;

  constructor(ipfs: IPFS, room: string, pinnerId: string) {
    super();
    this._ipfs = ipfs;
    if (!this._ipfs.pubsub) {
      throw new Error("This IPFS instance doesn't support pubsub");
    }

    this._room = room;
    this._pinnerId = pinnerId;
    this.online = false;
    this._outstandingPubsubMessages = [];
    this._handlePinnerMessageBound = this._handlePinnerMessage.bind(this);
    this._openConnections = 0;
  }

  get busy() {
    return !!this._openConnections || !!this._outstandingPubsubMessages.length;
  }

  _handlePinnerMessage(message: PubsubMessage) {
    // Don't process anything that doesn't come from a pinner
    if (!this.isPinner(message.from)) return;
    try {
      const pinnerAction = JSON.parse(message.data);
      this.emit('action', pinnerAction);
    } catch (caughtError) {
      log.error(new Error(`Could not parse pinner message: ${message.data}`));
    }
  }

  _handleNewPeer(peer: string) {
    // If no pinner id was given, everyone can be the pinner! Definitely not recommended.
    console.log('here is a new peer ' + peer)

    /**
     * @todo Maintain multiple pinner IDs for the PinnerConnector
     */
    if (this.isPinner(peer)) {
      this._setReady();
      this._flushPinnerMessages();
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

  _setReady() {
    this.online = true;
    if (this._resolveReadyPromise) {
      this._resolveReadyPromise(true);
      this._resolveReadyPromise = undefined;
    }
  }

  _tryUntil(
    fn: Function,
    condFn: (...args: any[]) => boolean,
    onTimeout: Function,
    tries: number = 5,
  ) {
    let retries = 0;
    let timeout;
    this._openConnections += 1;
    const retry = () => {
      fn();
      timeout = setTimeout(() => {
        if (retries === tries) {
          onTimeout();
          this._openConnections -= 1;
          clearTimeout(timeout);
          return;
        }
        retries += 1;
        retry();
      }, 10 * 1000);
    };
    retry();
    this.on('action', (action: PinnerAction) => {
      if (condFn(action)) {
        clearTimeout(timeout);
        this._openConnections -= 1;
      }
    });
  }

  isPinner(peer: string) {
    return peer === this._pinnerId;
  }

  async init() {
    if (this._id) throw new Error('Unable to re-initialize PinnerConnector');

    const { id } = await this._ipfs.id();
    this._id = id;
    await this._ipfs.pubsub.subscribe(
      this._room,
      this._handlePinnerMessageBound,
    );
    this._roomMonitor = new PeerMonitor(this._ipfs.pubsub, this._room);

    this._roomMonitor.on('join', this._handleNewPeer.bind(this));
    this._roomMonitor.on('leave', this._handleLeavePeer.bind(this));
    this._roomMonitor.on('error', log);
  }

  async ready() {
    if (this.online) return true;
    return new Promise((resolve, reject) => {
      this._resolveReadyPromise = resolve;
      setTimeout(() => {
        if (!this.online)
          reject(new Error('Could not connect to pinner in time'));
      }, PINNER_CONNECT_TIMEOUT);
    });
  }

  async disconnect() {
    await this._ipfs.pubsub.unsubscribe(
      this._room,
      this._handlePinnerMessageBound,
    );
    this._roomMonitor.stop();
  }

  async requestPinnedStore(address: string) {
    let listener;
    // const getHeads = new Promise(resolve => {
    //   listener = ({ type, to, payload }) => {
    //     if (type === PIN_ACTIONS.HAVE_HEADS && to === address) {
    //       resolve(payload);
    //       this.removeListener('action', listener);
    //     }
    //   };
    //   this.on('action', listener);
    // });
    const publishActionPromise = this._publishAction({
      type: PIN_ACTIONS.LOAD_STORE,
      payload: { address },
    });
    // const [heads] = await raceAgainstTimeout(
    //   Promise.all([getHeads, publishActionPromise]),
    //   PINNER_HAVE_HEADS_TIMEOUT,
    //   new Error(
    //     `Pinner did not react in time to get heads for store ${address}`,
    //   ),
    //   () => this.removeListener('action', listener),
    // );
    return publishActionPromise;
  }

  pinStore(address: string) {
    const pin = () =>
      this._publishAction({
        type: PIN_ACTIONS.PIN_STORE,
        payload: { address },
      });
    const condFn = ({ type, to }) =>
      type === PIN_ACTIONS.REPLICATED && to === address;
    const onTimeout = () =>
      console.warn(`Could not pin store with address ${address}`);

    this._tryUntil(pin, condFn, onTimeout, 5);
  }

  async pinHash(ipfsHash: string) {
    const pin = () =>
      this._publishAction({
        type: PIN_ACTIONS.PIN_HASH,
        payload: { ipfsHash },
      });
    const condFn = ({ type, payload: { ipfsHash: pinnedHash } }) =>
      type === PIN_ACTIONS.ACK && ipfsHash === pinnedHash;
    const onTimeout = () =>
      console.warn(`Could not pin ipfsHash ${ipfsHash} on pinner`);

    this._tryUntil(pin, condFn, onTimeout, 5);

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
