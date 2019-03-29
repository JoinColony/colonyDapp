/* @flow */

import BigNumber from 'bn.js';

import { ETHToken, CLNYToken, DAIToken, COOLToken } from './mockTokens';
import { TASK_STATE } from '~immutable';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const genericTaskProps = {
  colonyENSName: 'cool-colony',
  createdAt: new Date(1985, 10, 13),
  creator: '0x1afb213afa8729fa7908154b90e256f1be70989b',
  currentState: TASK_STATE.ACTIVE,
  description: 'my description',
  domainId: 1,
  draftId: undefined,
  dueDate: new Date(),
  manager: {
    address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
    didClaimPayout: false,
    didRate: false,
    didFailToRate: false,
  },
  payouts: [],
  reputation: undefined,
  skillId: undefined,
  title: undefined,
  requests: [],
  invites: [],
  worker: {
    address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    didClaimPayout: false,
    didRate: false,
    didFailToRate: false,
  },
};

const mockTasks = [
  {
    ...genericTaskProps,
    draftId: '1',
    colonyENSName: 'cool-colony',
    title: 'Develop Github integration',
    payouts: [
      { token: COOLToken, amount: createBN(600) },
      { token: ETHToken, amount: createBN(200105) },
      { token: DAIToken, amount: createBN(1001) },
      { token: CLNYToken, amount: createBN(600) },
    ],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '2',
    colonyENSName: 'cool-colony',
    title: 'Write docs for JS library',
    payouts: [{ token: ETHToken, amount: createBN(7) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '3',
    colonyENSName: 'cool-colony',
    title: 'Conduct user interviews on lo-fi prototypes',
    payouts: [
      { token: ETHToken, amount: createBN(200105) },
      { token: DAIToken, amount: createBN(4001) },
    ],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '4',
    colonyENSName: 'cool-colony',
    title: 'Create ux prototype of an Ethereum wallet',
    payouts: [
      { token: CLNYToken, amount: createBN(100) },
      { token: ETHToken, amount: createBN(900105) },
    ],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '5',
    colonyENSName: 'cool-colony',
    title: 'Translate Colony whitepaper',
    payouts: [{ token: CLNYToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '6',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '7',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '8',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '9',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '10',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '11',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '12',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '13',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '14',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
  {
    ...genericTaskProps,
    draftId: '15',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    manager: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989b',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
    worker: {
      address: '0x1afb213afa8729fa7908154b90e256f1be70989a',
      didClaimPayout: false,
      didRate: false,
      didFailToRate: false,
    },
  },
];

export default mockTasks;
