/* @flow */

import BigNumber from 'bn.js';

import type { TransactionType } from '~types/transaction';

import mockUser from './mockUser';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTransactions: Array<TransactionType> = [
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10000,
    date: new Date(),
    from: mockUser.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(10),
    symbol: 'ETH',
    transactionFee: createBN(2),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10001,
    date: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: mockUser.walletAddress,
    amount: createBN(1),
    symbol: 'ETH',
    transactionFee: createBN(5),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10002,
    date: new Date(),
    from: mockUser.walletAddress,
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(300),
    symbol: 'ETH',
    transactionFee: createBN(50),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10003,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.walletAddress,
    amount: createBN(52),
    symbol: 'FFLY',
    transactionFee: createBN(50),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10004,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: mockUser.walletAddress,
    amount: createBN(9000),
    symbol: 'FFLY',
    transactionFee: createBN(100),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10005,
    date: new Date(),
    from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
    to: mockUser.walletAddress,
    amount: createBN('0.05'),
    symbol: 'FFLY',
    transactionFee: createBN(10),
  },
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    nonce: 10006,
    date: new Date(),
    from: mockUser.walletAddress,
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(1002),
    symbol: 'FFLY',
    transactionFee: createBN(10),
  },
];

export default mockTransactions;
