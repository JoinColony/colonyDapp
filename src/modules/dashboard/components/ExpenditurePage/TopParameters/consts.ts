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
