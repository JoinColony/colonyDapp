import { defineMessages } from 'react-intl';

import { ConnectionType } from '~immutable/index';

const MSG = defineMessages({
  openStores: {
    id: 'core.NetworkHealth.openStores',
    defaultMessage: 'Open stores: {openStores}',
  },
  swarmPeers: {
    id: 'core.NetworkHealth.swarmPeers',
    defaultMessage: 'Swarm peers: {swarmPeers}',
  },
  ipfsPing: {
    id: 'core.NetworkHealth.ipfsPing',
    defaultMessage: 'IPFS ping to pinners: {ipfsPing}',
  },
  pinners: {
    id: 'core.NetworkHealth.pinners',
    defaultMessage: 'Pinners connected to: {pinners}',
  },
  pubsubPeers: {
    id: 'core.NetworkHealth.pubsubPeers',
    defaultMessage: 'Pubsub peers: {pubsubPeers}',
  },
  errors: {
    id: 'core.NetworkHealth.errors',
    defaultMessage: 'Store load errors: {errors}',
  },
});

// 3 = good, 2 = soso, 1 = poor

const openStoresHealth = openStores => (openStores ? 3 : 1);

const pingHealth = ping => {
  if (ping > 1000) return 1;
  return ping > 200 ? 2 : 3;
};

const pinnersHealth = pinners => {
  if (!pinners.length) return 1;
  return pinners.length === 1 ? 2 : 3;
};

const pubsubPeersHealth = pubsubPeers => {
  if (!pubsubPeers.length) return 1;
  return pubsubPeers.length < 5 ? 2 : 3;
};

const swarmPeersHealth = swarmPeers => {
  if (!swarmPeers.length) return 1;
  return swarmPeers.length < 5 ? 2 : 3;
};

const errorsHealth = errors => {
  if (!errors.length) return 3;
  return errors.length < 2 ? 2 : 1;
};

const calculateNetworkHealth = ({
  stats: {
    openStores = 0,
    ping = 0,
    pinners = [],
    pubsubPeers = [],
    swarmPeers = [],
  },
  errors,
}: ConnectionType) => [
  {
    itemTitle: MSG.openStores,
    itemHealth: openStoresHealth(openStores),
    itemTitleValues: { openStores: openStores || '0' },
  },
  {
    itemTitle: MSG.ipfsPing,
    itemHealth: pingHealth(ping),
    itemTitleValues: { ipfsPing: `${ping}ms` || '∞' },
  },
  {
    itemTitle: MSG.swarmPeers,
    itemHealth: swarmPeersHealth(swarmPeers),
    itemTitleValues: { swarmPeers: swarmPeers.length || '0' },
  },
  {
    itemTitle: MSG.pinners,
    itemHealth: pinnersHealth(pinners),
    itemTitleValues: { pinners: pinners.length || '0' },
  },
  {
    itemTitle: MSG.pubsubPeers,
    itemHealth: pubsubPeersHealth(pubsubPeers),
    itemTitleValues: { pubsubPeers: pubsubPeers.length || '0' },
  },
  {
    itemTitle: MSG.errors,
    itemHealth: errorsHealth(errors),
    itemTitleValues: { errors: errors.length || '0' },
  },
];

export default calculateNetworkHealth;
