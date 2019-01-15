/* @flow */

import BigNumber from 'bn.js';

import type { TransactionType } from '~types';

import mockUser from './mockUser';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTransactions: Array<TransactionType> = [
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10000',
    createdAt: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(10),
    symbol: 'ETH',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10001',
    createdAt: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: mockUser.profile.walletAddress,
    amount: createBN(1),
    symbol: 'ETH',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7as',
        id: '100013',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'pending',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7ef',
        id: '10004',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        dependency:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10011',
    createdAt: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: mockUser.profile.walletAddress,
    amount: createBN(1),
    symbol: 'ETH',
    status: 'failed',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10004',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'failed',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10002',
    createdAt: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(300),
    symbol: 'ETH',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7td',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10004',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'pending',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7cr',
        id: '10005',
        createdAt: new Date(),
        from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
        to: mockUser.profile.walletAddress,
        amount: createBN('0.05'),
        symbol: 'FFLY',
        dependency:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7dh',
        id: '10006',
        createdAt: new Date(),
        from: mockUser.profile.walletAddress,
        to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
        amount: createBN(1002),
        symbol: 'FFLY',
        dependency:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10003',
    createdAt: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.profile.walletAddress,
    amount: createBN(52),
    symbol: 'FFLY',
    status: 'multisig',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'multisig',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10004',
    createdAt: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.profile.walletAddress,
    amount: createBN(9000),
    symbol: 'FFLY',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10004',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'pending',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10005',
    createdAt: new Date(),
    from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
    to: mockUser.profile.walletAddress,
    amount: createBN('0.05'),
    symbol: 'FFLY',
    status: 'multisig',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7cn',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10004',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'multisig',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7tr',
        id: '10005',
        createdAt: new Date(),
        from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
        to: mockUser.profile.walletAddress,
        amount: createBN('0.05'),
        symbol: 'FFLY',
        dependency:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10006',
    createdAt: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(1002),
    symbol: 'FFLY',
    status: 'failed',
    dependents: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        id: '10003',
        createdAt: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'failed',
      },
    ],
  },
];

export default mockTransactions;
