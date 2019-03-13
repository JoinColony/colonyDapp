/* @flow */
/* eslint-disable max-len */

import BN from 'bn.js';

import usersMock from './mockUsers';
import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';

import {
  CLNYToken,
  COOLToken,
  DAIToken,
  ETHToken,
} from '../../../../../__mocks__/mockTokens';

/*
 * This should only be available once the task is finalized
 */
export const mockTaskReward = {
  workerRating: 3,
  payoutsEarned: [
    { token: DAIToken, amount: new BN(1001) },
    { token: CLNYToken, amount: new BN(600) },
    { token: ETHToken, amount: new BN(200105) },
    { token: COOLToken, amount: new BN(600) },
  ],
  reputationEarned: 1045,
};

export const mockTask = {
  id: 1,
  assignee: userMock,
  colonyENSName: 'cool-colony',
  manager: { address: '0x123collin' },
  worker: {},
  currentState: 'ACTIVE',
  draftId: '1',
  dueDate: new Date('2019-01-17'),
  reputation: 19.5,
  taskId: 1,
  title: 'Develop Github integration',
  taskStoreAddress: 'orbitDbHash',
  payouts: [
    {
      token: ETHToken,
      amount: new BN(21545),
      isEth: true,
      address: '0x0',
    },
    {
      amount: new BN(6007),
      token: CLNYToken,
    },
  ],
  feedItems: [
    {
      id: 8,
      createdAt: new Date('2018-11-08 11:00'),
      rating: {
        rater: usersMock.get(0),
        ratee: usersMock.get(1),
        rating: 2,
      },
    },
    {
      id: 9,
      createdAt: new Date('2018-11-08 11:00'),
      rating: {
        rater: usersMock.get(1),
        ratee: usersMock.get(0),
        rating: 3,
      },
    },
  ],
};

export default mockTask;
