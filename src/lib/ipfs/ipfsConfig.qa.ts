const config = () => ({
  repo: 'colonyIpfs',
  // config gets merged with the IPFS default config
  config: {
    Bootstrap: [],
  },
  preload: { enabled: false, addresses: [] },
});

export default config;
