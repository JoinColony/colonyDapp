/* @flow */

const genericColonyProps = {
  databases: {
    domainsIndex: '',
    draftsIndex: '',
  },
};

const mockColonies = [
  {
    ...genericColonyProps,
    name: 'Cool Colony',
    address: '0x92b6b00ea2e8152d33061bc7303078dc633ea42a',
    ensName: 'cool-colony',
    id: 2,
  },
  {
    ...genericColonyProps,
    name: 'Twitch.tv',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    ensName: 'twitch-tv',
    id: 4,
  },
  {
    ...genericColonyProps,
    name: 'Zirtual',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
    ensName: 'zirtual',
    id: 4,
  },
  {
    ...genericColonyProps,
    name: 'C21t',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989c',
    ensName: 'c21t',
    id: 5,
  },
  {
    ...genericColonyProps,
    name: 'Twitch.tv',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989d',
    ensName: 'twitch-tv',
    id: 6,
  },
  {
    ...genericColonyProps,
    name: 'Zirtual',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989e',
    ensName: 'zirtual',
    id: 7,
  },
  {
    ...genericColonyProps,
    name: 'C21t',
    address: '0x1afb213afa8729fa7908154b90e256f1be70989f',
    ensName: 'c21t',
    id: 8,
  },
];

export default mockColonies;
