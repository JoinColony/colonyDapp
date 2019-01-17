/* @flow */

import BigNumber from 'bn.js';

import type { TransactionType } from '~types';

import mockUser from '~dashboard/Wallet/__datamocks__/mockUser';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTransactions: Array<TransactionType> = [
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10000,
    date: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(10),
    symbol: 'ETH',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
      },
    ],
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10001,
    date: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: mockUser.profile.walletAddress,
    amount: createBN(1),
    symbol: 'ETH',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7as',
        nonce: 100013,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'pending',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7ef',
        nonce: 10004,
        date: new Date(),
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
    nonce: 10011,
    date: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: mockUser.profile.walletAddress,
    amount: createBN(1),
    symbol: 'ETH',
    status: 'failed',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10004,
        date: new Date(),
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
    nonce: 10002,
    date: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(300),
    symbol: 'ETH',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7td',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10004,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'pending',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7cr',
        nonce: 10005,
        date: new Date(),
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
        nonce: 10006,
        date: new Date(),
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
    nonce: 10003,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.profile.walletAddress,
    amount: createBN(52),
    symbol: 'FFLY',
    status: 'multisig',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
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
    nonce: 10004,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.profile.walletAddress,
    amount: createBN(9000),
    symbol: 'FFLY',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10004,
        date: new Date(),
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
    nonce: 10005,
    date: new Date(),
    from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
    to: mockUser.profile.walletAddress,
    amount: createBN('0.05'),
    symbol: 'FFLY',
    status: 'multisig',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7cn',
        nonce: 10003,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(52),
        symbol: 'FFLY',
        status: 'succeeded',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10004,
        date: new Date(),
        from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
        to: mockUser.profile.walletAddress,
        amount: createBN(9000),
        symbol: 'FFLY',
        status: 'multisig',
      },
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7tr',
        nonce: 10005,
        date: new Date(),
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
    nonce: 10006,
    date: new Date(),
    from: mockUser.profile.walletAddress,
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(1002),
    symbol: 'FFLY',
    status: 'failed',
    set: [
      {
        hash:
          '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
        nonce: 10003,
        date: new Date(),
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
