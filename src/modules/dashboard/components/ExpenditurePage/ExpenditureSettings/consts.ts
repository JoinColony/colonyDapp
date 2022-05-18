// It's temporary test data. Later data should be fetched from backend.

export const tokens = [
  {
    address: '0x0000000000000000000000000000000000000000',
    balances: [{ amount: '0', domainId: 0 }],
    decimals: 18,
    iconHash: '',
    id: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
  },
  {
    address: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    balances: [
      {
        amount: '0',
        domainId: 0,
      },
    ],
    decimals: 18,
    iconHash: null,
    id: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    name: 'test',
    symbol: 'MAT',
  },
];

export const domains = [
  {
    color: 0,
    description: null,
    ethDomainId: 1,
    ethParentDomainId: null,
    id: '0xeabe562c979679dc4023dd23e8c6aa782448c2e7_domain_1',
    name: 'Root',
    colonyAddress: '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7',
    withoutPadding: true,
  },
  {
    color: 1,
    description: null,
    ethDomainId: 2,
    ethParentDomainId: 1,
    id: '0xeabe562c979679dc4023dd23e8c6aa782448c2e7_domain_2',
    name: 'Dev',
    colonyAddress: '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7',
    withoutPadding: true,
  },
];

export const colonyAddress = '0xEaBE562C979679DC4023dD23e8C6aa782448c2E7';

export const userData = [
  {
    id: '1',
    profile: {
      walletAddress: '0xae57767918BB7c53aa26dd89f12913f5233d08D2',
      username: 'Chris',
      displayName: 'Christian Maniewski',
    },
  },
  {
    id: '2',
    profile: {
      walletAddress: '0x2C1d87E67b8D90d8A617adD3D1165f4B34C3838d',
      username: 'Elena',
      displayName: 'Elena Dimitrova',
    },
  },
  {
    id: '3',
    profile: {
      walletAddress: '0x1A2D59Be2B7d7D66C5e56E6F8463C58d3d762212',
      username: 'Thiago',
      displayName: 'Thiago Delgado',
    },
  },
  {
    id: '4',
    profile: {
      walletAddress: '0x650e7CdF785ae9B83b2f806151C6C7A0df38034A',
      username: 'Alex',
      displayName: 'Alex Rea',
    },
  },
  {
    id: '5',
    profile: {
      walletAddress: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
      username: 'Collin',
      displayName: 'Collin Vine',
    },
  },
];
