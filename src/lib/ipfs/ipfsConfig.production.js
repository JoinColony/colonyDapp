/* @flow */

const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Addresses: {
      Swarm: [
        // TODO: use our own star server
        // '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
      ],
    },
    Discovery: {
      webRTCStar: {
        enabled: true,
      },
    },
  },
  EXPERIMENTAL: {
    pubsub: true,
  },
});

export default config;
