/* @flow */

import BigNumber from 'bn.js';

import type { TransactionType } from '~types';

/*
 * @TODO Move this into a global helper
 * After we standardize on a format.
 *
 * This was copy-pasted from the task mocks in dashboard/Dashboard
 */
const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

export const mockTransactions: Array<TransactionType> = [
  /*
   * Incoming, from user to colony.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10000',
    createdAt: new Date(),
    from: '0x58dFd17cF6a6596AeBbbF1CbbF0F415b2d0A059F',
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(10),
    symbol: 'ETH',
  },
  /*
   * Incoming, from an unkown user to colony.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10001',
    createdAt: new Date(),
    from: '0x437a502354CE30d0273803AC5986247c0A51CE33',
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(1),
    symbol: 'ETH',
  },
  /*
   * Incoming, from a task to colony.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10002',
    createdAt: new Date(),
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(300),
    symbol: 'ETH',
  },
  /*
   * Outgoing, from a colony to an user.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10003',
    createdAt: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(52),
    symbol: 'FFLY',
  },
  /*
   * Outgoing, from a colony to a task.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10004',
    createdAt: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(9000),
    symbol: 'FFLY',
  },
  /*
   * Outgoing, from an unkown colony to a task.
   * This shouldn't really happen since we should always know the colony's name,
   * but for UI completeness sake, we're setting this up as well
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10005',
    createdAt: new Date(),
    from: '0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C',
    amount: createBN('0.05'),
    symbol: 'FFLY',
  },
  /*
   * Outgoing, from a task to an user.
   */
  {
    hash: '0x6f99abafeef056231b428dd94fc6f3c54a579ead0419a04efd643369f88aa7e9',
    id: '10006',
    createdAt: new Date(),
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(1002),
    symbol: 'FFLY',
  },
];

export const mockedColoniesAddressBook: Object = {
  '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507': {
    name: 'Firefly',
  },
  '0x1afb213afa8729fa7908154b90e256f1be70989a': {
    name: 'The Meta Colony',
  },
};

export const mockedUsersAddressBook: Object = {
  '0x58dFd17cF6a6596AeBbbF1CbbF0F415b2d0A059F': {
    username: 'mal',
    displayName: 'Malcolm Reynolds',
  },
  '0x044d83437c464Db2F33b863327ea60444FC587b2': {
    username: 'sihnon',
    displayName: 'Inara Serra',
  },
};

export const mockedTasksList: Object = {
  /*
   * Right now we are indexing these based on ids, but this will most likely
   * have some sort of other type of anchor point (transaction hash?)
   */
  '10002': {
    id: 203,
    title: 'Rent out the shuttle',
  },
  '10004': {
    id: 204,
    title: 'That business you helped with back on Persephone',
  },
  '10005': {
    id: 205,
    title: 'Watch how I soar',
  },
  '10006': {
    id: 206,
    title: "You can't stop the signal",
  },
};
