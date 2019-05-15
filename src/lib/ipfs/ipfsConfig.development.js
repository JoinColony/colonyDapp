/* @flow */

const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Addresses: {
      Swarm: ['/ip4/127.0.0.1/tcp/9091/ws/p2p-websocket-star'],
    },
    Bootstrap: [
      // This is the connection to the dev ipfs daemon (for the pinner)
      /* eslint-disable max-len */
      '/ip4/127.0.0.1/tcp/4001/ipfs/QmQBF89g7VHjcQVNGEf5jKZnU5r6J8G2vfHzBpivKqgxs6',
      '/ip4/127.0.0.1/tcp/4004/wss/ipfs/QmQBF89g7VHjcQVNGEf5jKZnU5r6J8G2vfHzBpivKqgxs6',
      /* eslint-enable max-len */
    ],
  },
  EXPERIMENTAL: {
    pubsub: true,
  },
});

export default config;
