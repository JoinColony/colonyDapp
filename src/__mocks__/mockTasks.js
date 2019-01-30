/* @flow */

import BigNumber from 'bn.js';

import { ETHToken, CLNYToken, DAIToken, COOLToken } from './mockTokens';
import { TASK_STATE } from '~immutable';

const createBN = val =>
  new BigNumber(val).mul(new BigNumber(10).pow(new BigNumber(17)));

const genericTaskProps = {
  assignee: undefined,
  colonyENSName: 'cool-colony',
  creator: 'collin',
  currentState: TASK_STATE.ACTIVE,
  domainId: 1,
  draftId: undefined,
  dueDate: new Date(),
  evaluatorHasRated: undefined,
  evaluatorPayoutClaimed: undefined,
  evaluatorRateFail: undefined,
  feedItems: [],
  managerHasRated: undefined,
  managerPayoutClaimed: undefined,
  managerRateFail: undefined,
  managerRating: undefined,
  payouts: [],
  reputation: undefined,
  skillId: undefined,
  taskId: undefined,
  title: undefined,
  workerHasRated: undefined,
  workerPayoutClaimed: undefined,
  workerRateFail: undefined,
  workerRating: undefined,
};

const mockTasks = [
  {
    ...genericTaskProps,
    draftId: '1',
    colonyENSName: 'cool-colony',
    title: 'Develop Github integration',
    reputation: 19.5,
    payouts: [
      { token: COOLToken, amount: createBN(600) },
      { token: ETHToken, amount: createBN(200105) },
      { token: DAIToken, amount: createBN(1001) },
      { token: CLNYToken, amount: createBN(600) },
    ],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '2',
    colonyENSName: 'cool-colony',
    title: 'Write docs for JS library',
    reputation: 35,
    payouts: [{ token: ETHToken, amount: createBN(7) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '3',
    colonyENSName: 'cool-colony',
    title: 'Conduct user interviews on lo-fi prototypes',
    reputation: 5,
    payouts: [
      { token: ETHToken, amount: createBN(200105) },
      { token: DAIToken, amount: createBN(4001) },
    ],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '4',
    colonyENSName: 'cool-colony',
    title: 'Create ux prototype of an Ethereum wallet',
    reputation: 8,
    payouts: [
      { token: CLNYToken, amount: createBN(100) },
      { token: ETHToken, amount: createBN(900105) },
    ],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '5',
    colonyENSName: 'cool-colony',
    title: 'Translate Colony whitepaper',
    reputation: 1,
    payouts: [{ token: CLNYToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '6',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '7',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '8',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '9',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '10',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '11',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '12',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '13',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '14',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
  {
    ...genericTaskProps,
    draftId: '15',
    colonyENSName: 'cool-colony',
    title: '5 week open developer project',
    reputation: 1,
    payouts: [{ token: ETHToken, amount: createBN(100) }],
    creator: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    assignee: {
      activities: [],
      profile: {
        activitiesStore: '',
        profileStore: '',
        walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
        username: 'user',
      },
    },
  },
];

export default mockTasks;
