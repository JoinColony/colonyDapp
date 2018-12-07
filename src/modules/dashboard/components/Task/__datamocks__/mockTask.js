/* @flow */
/* eslint-disable max-len */

import { Task } from '../../../records';
import usersMock from './mockUsers';
import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';

/*
 * This should only be available, once the task is finalized
 */
export const mockTaskReward = {
  workerRating: 3,
  payoutsEarned: [
    { symbol: 'DAI', amount: 1001 },
    { symbol: 'CLNY', amount: 600 },
    { symbol: 'ETH', amount: 200105 },
    { symbol: 'COOL', amount: 600 },
  ],
  reputationEarned: 1045,
};

export const mockTask = Task({
  id: 1,
  title: 'Develop Github integration',
  colonyIdentifier: '0xdd90e005D1Cebb6621B673d3116b5E2CF6f1B902',
  reputation: 19.5,
  payouts: [
    { symbol: 'ETH', amount: 21545, isEth: true, address: '0x0' },
    {
      symbol: 'CLNY',
      amount: 6007,
      isNative: true,
      address: '0xdd90e005D1Cebb6621B673d3116b5E2CF6f1B902',
    },
    {
      symbol: 'COOL',
      amount: 123,
      address: '0xF3d1052710d69707184F78bAee1FA523F41AFc4A',
    },
  ],
  creator: '0x230da0f9u4qtj09ajg240qutgadjf0ajtaj',
  assignee: userMock,
  feedItems: [
    {
      id: 0,
      body: 'Comment body goes here...',
      timestamp: new Date('2018-09-16'),
      user: usersMock[0],
      type: 'comment',
    },
    {
      id: 1,
      body:
        'This is another comment, this time with a link to https://colony.io!',
      timestamp: new Date('2018-11-03'),
      user: usersMock[1],
      type: 'comment',
    },
    {
      id: 2,
      body: 'YANC',
      timestamp: new Date('2018-11-03 13:00'),
      user: usersMock[0],
      type: 'comment',
    },
    {
      id: 3,
      body: "It's me, @chewie the task creator!",
      timestamp: new Date('2018-11-03 13:15'),
      user: userMock,
      type: 'comment',
    },
    {
      id: 4,
      body: 'Interesting conversation going on here.',
      timestamp: new Date('2018-11-03 13:30'),
      user: usersMock[2],
      type: 'comment',
    },
    {
      id: 5,
      body: '^agree',
      timestamp: new Date('2018-11-03 14:00'),
      user: usersMock[3],
      type: 'comment',
    },
    {
      id: 6,
      body: `We should
have these
conversations
more often.`,
      timestamp: new Date('2018-11-06 11:00'),
      user: userMock,
      type: 'comment',
    },
    {
      id: 7,
      body:
        'Also I feel like posting another comment just to test how it looks with two consecutive by the same account.',
      timestamp: new Date('2018-11-06 11:30'),
      user: userMock,
      type: 'comment',
    },
    {
      id: 8,
      rater: usersMock[0],
      ratee: usersMock[1],
      rating: 2,
      timestamp: new Date('2018-11-08 11:00'),
      type: 'rating',
    },
    {
      id: 9,
      rater: usersMock[1],
      ratee: usersMock[0],
      rating: 3,
      timestamp: new Date('2018-11-08 11:00'),
      type: 'rating',
    },
  ],
});

export default mockTask;
