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
        /*
         * @TODO Fix the `webRTCStar` production config
         * @BODY Disabled due to breaking the `production` build (expecting `undefined`)
         */
        /* enabled: true, */
      },
    },
  },
  EXPERIMENTAL: {
    pubsub: true,
  },
});

export default config;
