/* @flow */

import BigNumber from 'bn.js';
import { List } from 'immutable';

import { Task, TaskPayout, User, UserProfile } from '~immutable';

import { ETHToken, CLNYToken, DAIToken, COOLToken } from './mockTokens';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const mockTasks = List.of(
  Task({
    id: 1,
    colonyENSName: 'cool-colony',
    title: 'Develop Github integration',
    reputation: 19.5,
    payouts: List.of(
      TaskPayout({ token: COOLToken, amount: createBN(600) }),
      TaskPayout({ token: ETHToken, amount: createBN(200105) }),
      TaskPayout({ token: DAIToken, amount: createBN(1001) }),
      TaskPayout({ token: CLNYToken, amount: createBN(600) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 2,
    colonyENSName: 'cool-colony',
    title: 'Write docs for JS library',
    reputation: 35,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(7) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 3,
    colonyENSName: 'cool-colony',
    title: 'Conduct user interviews on lo-fi prototypes',
    reputation: 5,
    payouts: List.of(
      TaskPayout({ token: ETHToken, amount: createBN(200105) }),
      TaskPayout({ token: DAIToken, amount: createBN(4001) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 4,
    colonyENSName: 'cool-colony',
    title: 'Create ux prototype of an Ethereum wallet',
    reputation: 8,
    payouts: List.of(
      TaskPayout({ token: CLNYToken, amount: createBN(100) }),
      TaskPayout({ token: ETHToken, amount: createBN(900105) }),
    ),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 5,
    colonyENSName: 'cool-colony',
    title: 'Translate Colony whitepaper',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: CLNYToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 6,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 7,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 8,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 9,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 10,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 11,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 12,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 13,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 14,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
  Task({
    id: 15,
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: List.of(TaskPayout({ token: ETHToken, amount: createBN(100) })),
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: User({
      profile: UserProfile({
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      }),
    }),
  }),
);

export default mockTasks;
