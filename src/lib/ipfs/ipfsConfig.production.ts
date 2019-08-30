const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Addresses: {
      Swarm: [
        '/dns4/colony.io/tcp/9090/wss/p2p-websocket-star/',
        '/dns4/colony.io/tcp/9091/wss/p2p-webrtc-star/',
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
