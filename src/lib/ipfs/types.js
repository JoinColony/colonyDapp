/* @flow */

import type PeerInfo from 'peer-info';
import type MultiAddr from 'multiaddr';

import type { OrbitDBAddress } from '~types';

export type IPFSPeer = {
  addr: MultiAddr,
  peer: PeerInfo,
};

export type B58String = string;

export type IPFSNodeOptions = {
  ipfs: {
    repo: string,
    config: {
      Bootstrap: string[],
      Addresses: {
        Swarm: string[],
      },
    },
    EXPERIMENTAL: {
      pubsub: boolean,
    },
    Discovery?: {
      webRTCStar: {
        enabled: boolean,
      },
    },
  },
  timeout: number,
};

export type PinnerAction = {
  type: string,
  to?: OrbitDBAddress,
  payload: Object,
};
