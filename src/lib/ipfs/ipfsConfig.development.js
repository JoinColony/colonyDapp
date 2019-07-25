/* @flow */

const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Addresses: {
      Swarm: ['/ip4/127.0.0.1/tcp/9091/ws/p2p-websocket-star'],
    },
    Bootstrap: [],
  },
  EXPERIMENTAL: {
    pubsub: true,
  },
});

export default config;
