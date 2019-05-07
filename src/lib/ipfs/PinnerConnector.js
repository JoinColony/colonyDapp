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
    if (message.from !== this._pinnerId) return;
    let pinnerAction: PinnerAction;
    try {
      pinnerAction = JSON.parse(message.data);
      this.emit('action', pinnerAction);
    } catch (caughtError) {
      log.error(new Error(`Could not parse pinner message: ${message.data}`));
    }
  }

  async _handleNewPeer(peer: string) {
    // If no pinner id was given, everyone can be the pinner! Definitely not recommended.

    /**
     * @todo Maintain multiple pinner IDs for the PinnerConnector
     */
    if (peer === this._pinnerId) {
      this.online = true;
      this._flushPinnerMessages();
    }
  }

  _handleLeavePeer(peer: string) {
    // When we have multiple pinner IDs, we are offline when the
    // last one leaves.
    if (peer === this._pinnerId) {
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

  async disconnect() {
    await this._ipfs.pubsub.unsubscribe(
      this._room,
      this._handlePinnerMessageBound,
    );
    this._roomMonitor.stop();
  }

  async requestPinnedStore(address: string) {
    let listener;
    const getHeads = new Promise(resolve => {
      listener = ({ type, to, payload }) => {
        if (type === PIN_ACTIONS.HAVE_HEADS && to === address) {
          resolve(payload);
          this.removeListener('action', listener);
        }
      };
      this.on('action', listener);
    });
    const publishActionPromise = this._publishAction({
      type: PIN_ACTIONS.LOAD_STORE,
      payload: { address },
    });
    return raceAgainstTimeout(
      Promise.all([getHeads, publishActionPromise]),
      10000,
      new Error('Pinner did not react in time'),
      () => this.removeListener('action', listener),
    );
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
