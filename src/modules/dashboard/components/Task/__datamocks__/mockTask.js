/* @flow */
/* eslint-disable max-len */

import { List } from 'immutable';
import BN from 'bn.js';

import { Task, TaskFeedItem, TaskFeedItemRating, TaskPayout } from '~immutable';
import usersMock from './mockUsers';
import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';

import {
  CLNYToken,
  COOLToken,
  DAIToken,
  ETHToken,
} from '../../../../../__mocks__/mockTokens';

/*
 * This should only be available, once the task is finalized
 */
export const mockTaskReward = {
  workerRating: 3,
  payoutsEarned: List.of(
    TaskPayout({ token: DAIToken, amount: new BN(1001) }),
    TaskPayout({ token: CLNYToken, amount: new BN(600) }),
    TaskPayout({ token: ETHToken, amount: new BN(200105) }),
    TaskPayout({ token: COOLToken, amount: new BN(600) }),
  ),
  reputationEarned: 1045,
};

export const mockTask = Task({
  id: 1,
  title: 'Develop Github integration',
  colonyENSName: 'cool-colony',
  reputation: 19.5,
  dueDate: new Date('2019-01-17'),
  payouts: List.of(
    TaskPayout({
      token: ETHToken,
      amount: new BN(21545),
      isEth: true,
      address: '0x0',
    }),
    TaskPayout({
      amount: new BN(6007),
      token: CLNYToken,
    }),
    TaskPayout({
      amount: new BN(123),
      token: COOLToken,
    }),
  ),
  creator: '0x230da0f9u4qtj09ajg240qutgadjf0ajtaj',
  assignee: userMock,
  feedItems: List.of(
    TaskFeedItem({
      id: 8,
      createdAt: new Date('2018-11-08 11:00'),
      rating: TaskFeedItemRating({
        rater: usersMock.get(0),
        ratee: usersMock.get(1),
        rating: 2,
      }),
    }),

    TaskFeedItem({
      id: 9,
      createdAt: new Date('2018-11-08 11:00'),
      rating: TaskFeedItemRating({
        rater: usersMock.get(1),
        ratee: usersMock.get(0),
        rating: 3,
      }),
    }),
  ),
});

export default mockTask;
