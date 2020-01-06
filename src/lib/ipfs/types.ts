// eslint-disable-next-line import/no-extraneous-dependencies
import PeerInfo from 'peer-info';
// eslint-disable-next-line import/no-extraneous-dependencies
import MultiAddr from 'multiaddr';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPFSPeer {
  addr: MultiAddr;
  peer: PeerInfo;
}

export type B58String = string;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPFSOptions {
  repo: string;
  config: {
    Bootstrap: string[];
    Addresses: {
      Swarm: string[];
    };
    Discovery?: {
      webRTCStar: {
        enabled: boolean;
      };
    };
  };
  EXPERIMENTAL: {
    pubsub: boolean;
  };
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPFSNodeOptions {
  timeout: number;
}
