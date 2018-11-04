/* @flow */
/* eslint-disable max-len */

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

export const mockTask = {
  id: 1,
  title: 'Develop Github integration',
  reputation: 19.5,
  payouts: [
    { symbol: 'ETH', amount: 21545, isEth: true },
    { symbol: 'CLNY', amount: 6007, isNative: true },
  ],
  creator: '0x230da0f9u4qtj09ajg240qutgadjf0ajtaj',
  assignee: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'Elena',
    displayName: 'Elena Dimitrova',
  },
  payoutClaimed: false,
  finalized: false,
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
  ],
};

export default mockTask;
