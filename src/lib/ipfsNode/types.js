/* @flow */

import type PeerInfo from 'peer-info';
import type MultiAddr from 'multiaddr';

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
        Gateway: string,
        Swarm: string[],
      },
    },
    EXPERIMENTAL: {
      pubsub: boolean,
    },
    Discovery: {
      webRTCStar: {
        enabled: boolean,
      },
    },
  },
  timeout: number,
};
