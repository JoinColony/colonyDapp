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
};

class PinnerConnector extends EventEmitter {
  _id: string;

  _ipfs: IPFS;

  _outstandingPubsubMessages: Array<PinnerAction>;

  // Can be an array in the future
  _pinnerId: string;

  _room: string;

  _roomMonitor: PeerMonitor;

  online: boolean;

  _handlePinnerMessageBound: (message: PubsubMessage) => void;

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
  }

  _handlePinnerMessage(message: PubsubMessage) {
    // Don't process anything that doesn't come from a pinner
    if (message.from !== this._pinnerId) return;
    let pinnerAction: PinnerAction;
    try {
      pinnerAction = JSON.parse(message.data);
      this.emit('action', pinnerAction);
    } catch (e) {
      log(new Error(`Could not parse pinner message: ${message.data}`));
    }
  }

  async _handleNewPeer(peer: string) {
    // If no pinner id was given, everyone can be the pinner! Definitely not recommended.
    // TODO: In the future, we can maintain multiple ids here
    if (peer === this._pinnerId) {
      this.online = true;
      await this._flushPinnerMessages();
    }
  }

  _handleLeavePeer(peer: string) {
    // TODO: Likewise. When the last pinner leaves we are offline
    if (peer === this._pinnerId) {
      this.online = false;
    }
  }

  async _flushPinnerMessages() {
    await Promise.all(
      this._outstandingPubsubMessages.map(message =>
        this._publishAction(message),
      ),
    );
    this._outstandingPubsubMessages = [];
  }

  async _publishAction(action: PinnerAction) {
    if (this.online) {
      await this._ipfs.pubsub.publish(
        this._room,
        Buffer.from(JSON.stringify(action)),
      );
    } else {
      this._outstandingPubsubMessages.push(action);
    }
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
        if (type === PIN_ACTIONS.HAVE_HEADS && to === address) resolve(payload);
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

  async pinStore(address: string) {
    return this._publishAction({
      type: PIN_ACTIONS.PIN_STORE,
      payload: { address },
    });
  }

  async pinHash(ipfsHash: string) {
    await this._publishAction({
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
