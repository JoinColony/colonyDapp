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
      Swarm: [
        '/dns4/qa.colony.io/tcp/9090/wss/p2p-websocket-star/',
        '/dns4/qa.colony.io/tcp/9091/wss/p2p-webrtc-star/',
      ],
    },
    Bootstrap: [],
    Discovery: {
      webRTCStar: {
        Enabled: true,
      },
    },
  },
  preload: { enabled: false, addresses: [] },
  EXPERIMENTAL: {
    pubsub: true,
  },
});

export default config;
