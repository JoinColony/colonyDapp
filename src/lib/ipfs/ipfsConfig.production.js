/* @flow */

/**
 * @todo Use our own star server for IPFS
 * @body Suggestion: `Swarm: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star']`
 */
const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Addresses: {
      Swarm: [],
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
