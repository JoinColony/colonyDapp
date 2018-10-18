/* @flow */

import BigNumber from 'bn.js';

import type { TransactionType } from '~types/transaction';

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
    nonce: 10000,
    date: new Date(),
    from: '0x58dFd17cF6a6596AeBbbF1CbbF0F415b2d0A059F',
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(10),
    symbol: 'ETH',
  },
  /*
   * Incoming, from a task to colony.
   */
  {
    nonce: 10001,
    date: new Date(),
    to: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(300),
    symbol: 'ETH',
  },
  /*
   * Outgoing, from a colony to an user.
   */
  {
    nonce: 10002,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    to: '0x044d83437c464Db2F33b863327ea60444FC587b2',
    amount: createBN(52),
    symbol: 'FFLY',
  },
  /*
   * Outgoing, from a colony to a task.
   */
  {
    nonce: 10003,
    date: new Date(),
    from: '0x344FD3EaDF01E9BF077f4a3208439A3A4A428507',
    amount: createBN(9000),
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
   * Right now we are indexing these based on nonces, but this will most likely
   * have some sort of other type of anchor point (transaction hash?)
   */
  '10001': {
    id: 203,
    title: 'Rent out the shuttle',
  },
  '10003': {
    id: 204,
    title: 'That business you helped with back on Persephone',
  },
};

// 0x437a502354CE30d0273803AC5986247c0A51CE33
// 0x62B79Ed3CAefdc32963cCc96Ae619D606B825E6C
