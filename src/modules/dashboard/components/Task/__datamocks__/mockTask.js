/* @flow */
/* eslint-disable max-len */

import { List } from 'immutable';

import {
  Task,
  TaskFeedItem,
  TaskFeedItemComment,
  TaskFeedItemRating,
  TaskPayout,
} from '~immutable';
import usersMock from './mockUsers';
import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';

/*
 * This should only be available, once the task is finalized
 */
export const mockTaskReward = {
  workerRating: 3,
  payoutsEarned: List.of(
    TaskPayout({ symbol: 'DAI', amount: 1001 }),
    TaskPayout({ symbol: 'CLNY', amount: 600 }),
    TaskPayout({ symbol: 'ETH', amount: 200105 }),
    TaskPayout({ symbol: 'COOL', amount: 600 }),
  ),
  reputationEarned: 1045,
};

export const mockTask = Task({
  id: 1,
  title: 'Develop Github integration',
  colonyENSName: 'cool-colony',
  reputation: 19.5,
  payouts: List.of(
    TaskPayout({ symbol: 'ETH', amount: 21545, isEth: true }),
    TaskPayout({ symbol: 'CLNY', amount: 6007, isNative: true }),
  ),
  creator: '0x230da0f9u4qtj09ajg240qutgadjf0ajtaj',
  assignee: userMock,
  feedItems: List.of(
    TaskFeedItem({
      id: 0,
      createdAt: new Date('2018-09-16'),
      comment: TaskFeedItemComment({
        body: 'Comment body goes here...',
        user: usersMock.get(0),
      }),
    }),

    TaskFeedItem({
      id: 1,
      comment: TaskFeedItemComment({
        body:
          'This is another comment, this time with a link to https://colony.io!',
        user: usersMock.get(1),
      }),
    }),

    TaskFeedItem({
      id: 2,
      createdAt: new Date('2018-11-03 13:00'),
      comment: TaskFeedItemComment({
        body: 'YANC',
        user: usersMock.get(0),
      }),
    }),

    TaskFeedItem({
      id: 3,
      createdAt: new Date('2018-11-03 13:15'),
      comment: TaskFeedItemComment({
        body: "It's me, @chewie the task creator!",
        user: userMock,
      }),
    }),

    TaskFeedItem({
      id: 4,
      createdAt: new Date('2018-11-03 13:30'),
      comment: TaskFeedItemComment({
        body: 'Interesting conversation going on here.',
        user: usersMock.get(2),
      }),
    }),

    TaskFeedItem({
      id: 5,
      createdAt: new Date('2018-11-03 14:00'),
      comment: TaskFeedItemComment({
        body: '^agree',
        user: usersMock.get(3),
      }),
    }),

    TaskFeedItem({
      id: 6,
      createdAt: new Date('2018-11-06 11:00'),
      comment: TaskFeedItemComment({
        body: `We should
have these
conversations
more often.`,
        user: userMock,
      }),
    }),

    TaskFeedItem({
      id: 7,
      createdAt: new Date('2018-11-06 11:30'),
      comment: TaskFeedItemComment({
        body:
          'Also I feel like posting another comment just to test how it looks with two consecutive by the same account.',
        user: userMock,
      }),
    }),

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
