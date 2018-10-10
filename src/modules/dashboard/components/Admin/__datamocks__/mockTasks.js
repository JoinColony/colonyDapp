/* @flow */

import BigNumber from 'bn.js';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTasks = [
  {
    id: 1,
    title: 'Develop Github integration',
    reputation: 19.5,
    payouts: [
      { symbol: 'COOL', amount: createBN(600) },
      { symbol: 'ETH', amount: createBN(200105) },
      { symbol: 'DAI', amount: createBN(1001) },
      { symbol: 'CLNY', amount: createBN(600) },
    ],
    creator: '0xbeefdead',
    assignee: {
      walletAddress: '0xdeadbeef',
      username: 'user',
    },
  },
  {
    id: 2,
    title: 'Write docs for JS library',
    reputation: 35,
    payouts: [{ symbol: 'ETH', amount: createBN(7) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xbeefdead',
      username: 'user',
    },
  },
  {
    id: 3,
    title: 'Conduct user interviews on lo-fi prototypes',
    reputation: 5,
    payouts: [
      { symbol: 'ETH', amount: createBN(200105) },
      { symbol: 'DAI', amount: createBN(4001) },
    ],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 4,
    title: 'Create ux prototype of an Ethereum wallet',
    reputation: 8,
    payouts: [
      { symbol: 'CLNY', amount: createBN(100) },
      { symbol: 'ETH', amount: createBN(900105) },
    ],
    creator: '0xfeedbeef',
    assignee: {
      walletAddress: '0xdeadbeef',
      username: 'user',
    },
  },
  {
    id: 5,
    title: 'Translate Colony whitepaper',
    reputation: 1,
    payouts: [{ symbol: 'CLNY', amount: createBN(100) }],
    creator: '0xfeedbeef',
    assignee: {
      walletAddress: '0xdeadbeef',
      username: 'user',
    },
  },
  {
    id: 6,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 7,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 8,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 9,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 10,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 11,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 12,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 13,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 14,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
  {
    id: 15,
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ symbol: 'ETH', amount: createBN(100) }],
    creator: '0xdeadbeef',
    assignee: {
      walletAddress: '0xfeedbeef',
      username: 'user',
    },
  },
];

export default mockTasks;
