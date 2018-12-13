/* @flow */

import EventEmitter from 'events';
import PeerMonitor from 'ipfs-pubsub-peer-monitor';
import IPFS from 'ipfs';

import { log } from '~utils/debug';
import { raceAgainstTimeout } from '~utils/async';

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
};

class PinnerConnector extends EventEmitter {
  _id: string;

  _ipfs: IPFS;

  _outstandingPubsubMessages: Array<PinnerAction>;

  // Can be an array in the future
  _pinnerId: ?string;

  _room: string;

  _roomMonitor: PeerMonitor;

  online: boolean;

  _handlePinnerMessageBound: (message: PubsubMessage) => void;

  constructor(ipfs: IPFS, room: string, pinnerId: ?string) {
    super();
    this._ipfs = ipfs;
    if (!this._ipfs.pubsub) {
      throw new Error("This IPFS instance doesn't support pubsub");
    }

    this._room = room;
    this._pinnerId = pinnerId;
    this.online = false;
    this._handlePinnerMessageBound = this._handlePinnerMessage.bind(this);
  }

  _handlePinnerMessage(message: PubsubMessage) {
    // Don't process anything that doesn't come from a pinner
    if (message.from !== this._pinnerId) return;
    let pinnerAction: PinnerAction;
    try {
      pinnerAction = JSON.parse(message.data);
    } catch (e) {
      log(new Error(`Could not parse pinner message: ${message.data}`));
    }
    this.emit('action', pinnerAction);
  }

  _handleNewPeer(peer: string) {
    // If no pinner id was given, everyone can be the pinner! Definitely not recommended.
    // TODO: In the future, we can maintain multiple ids here
    if (!this._pinnerId || peer === this._pinnerId) {
      this.online = true;
      this._flushPinnerMessages();
    }
  }

  _handleLeavePeer(peer: string) {
    // TODO: Likewise. When the last pinner leaves we are offline
    if (peer === this._pinnerId) {
      this.online = false;
    }
  }

  _flushPinnerMessages() {
    this._outstandingPubsubMessages.forEach(message => {
      this._pubsubPublish(message);
    });
    this._outstandingPubsubMessages = [];
  }

  _pubsubPublish(message: PinnerAction) {
    if (this.online) {
      this._ipfs.pubsub.publish(
        this._room,
        Buffer.from(JSON.stringify(message)),
      );
    } else {
      this._outstandingPubsubMessages.push(message);
    }
  }

  async init() {
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
    const getHeads = new Promise(resolve => {
      this._pubsubPublish({
        type: PIN_ACTIONS.LOAD_STORE,
        payload: { address },
      });
      const listener = ({ type, to, payload }) => {
        if (type === PIN_ACTIONS.HAVE_HEADS && to === address) {
          resolve(payload);
          this.removeListener('action', listener);
        }
      };
      this.on('action', listener);
    });
    return raceAgainstTimeout(
      getHeads,
      10000,
      new Error('Pinner did not react in time'),
    );
  }

  pinStore(address: string) {
    this._pubsubPublish({
      type: PIN_ACTIONS.PIN_STORE,
      payload: { address },
    });
  }
}

export default PinnerConnector;
