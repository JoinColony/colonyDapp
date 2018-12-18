/* @flow */

import type PeerInfo from 'peer-info';
import type MultiAddr from 'multiaddr';

import type { OrbitDBAddress } from '~types';

export type IPFSPeer = {
  addr: MultiAddr,
  peer: PeerInfo,
};

export type B58String = string;

export type IPFSOptions = {
  repo: string,
  config: {
    Bootstrap: string[],
    Addresses: {
      Swarm: string[],
    },
    Discovery?: {
      webRTCStar: {
        enabled: boolean,
      },
    },
  },
  EXPERIMENTAL: {
    pubsub: boolean,
  },
};

export type IPFSNodeOptions = {
  timeout: number,
};

export type PinnerAction = {
  type: string,
  to?: OrbitDBAddress,
  payload: Object,
};
