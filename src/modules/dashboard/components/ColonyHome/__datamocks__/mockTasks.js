/* @flow */

import BigNumber from 'bn.js';
import { List } from 'immutable';

import { Task, TaskPayout } from '../../../records';
import { User } from '../../../../users/records';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTasks = List.of(
  Task({
    id: 1,
    title: 'Develop Github integration',
    reputation: 19.5,
    payouts: List.of(
      TaskPayout({ symbol: 'COOL', amount: createBN(600) }),
      TaskPayout({ symbol: 'ETH', amount: createBN(200105) }),
      TaskPayout({ symbol: 'DAI', amount: createBN(1001) }),
      TaskPayout({ symbol: 'CLNY', amount: createBN(600) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 2,
    title: 'Write docs for JS library',
    reputation: 35,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(7) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 3,
    title: 'Conduct user interviews on lo-fi prototypes',
    reputation: 5,
    payouts: List.of(
      TaskPayout({ symbol: 'ETH', amount: createBN(200105) }),
      TaskPayout({ symbol: 'DAI', amount: createBN(4001) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 4,
    title: 'Create ux prototype of an Ethereum wallet',
    reputation: 8,
    payouts: List.of(
      TaskPayout({ symbol: 'CLNY', amount: createBN(100) }),
      TaskPayout({ symbol: 'ETH', amount: createBN(900105) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 5,
    title: 'Translate Colony whitepaper',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'CLNY', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 6,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 7,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 8,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 9,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 10,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 11,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 12,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 13,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 14,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
  Task({
    id: 15,
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ symbol: 'ETH', amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      username: 'user',
    }),
  }),
);

export default mockTasks;
