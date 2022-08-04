// It's temporary test data. Later data should be fetched from backend.

export const tokens = [
  {
    id: '0x0000000000000000000000000000000000000000',
    address: '0x0000000000000000000000000000000000000000',
    balances: [{ id: 1, amount: '0', domainId: 0 }],
    decimals: 18,
    symbol: 'ETH',
    name: 'Ether',
    iconHash: '',
    verified: true,
    balance: '10',
  },
  {
    address: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    balances: [
      {
        id: 2,
        amount: '0',
        domainId: 0,
      },
    ],
    decimals: 18,
    id: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    name: 'test',
    symbol: 'MAT',
    iconHash: '',
    verified: true,
    balance: '10',
  },
];

export const requiredFundsMock = [
  {
    address: '0x0000000000000000000000000000000000000000',
    balances: [{ amount: '2015', domainId: 0 }],
    decimals: 2,
    iconHash: '',
    id: '0x0000000000000000000000000000000000000000',
    name: 'xDAI',
    symbol: 'ETH',
    isPartial: true,
    total: [{ amount: '3015', domainId: 0 }],
  },
  {
    address: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    balances: [
      {
        amount: '2005',
        domainId: 0,
      },
    ],
    decimals: 2,
    iconHash: null,
    id: '0x3Fe98e1e643c3f78aCF72B7FC4A68B5A737CD274',
    name: 'CLNY',
    symbol: 'CLNY',
    isPartial: false,
  },
];
