/* @flow */

import type { RecordOf } from 'immutable';
import type { UserRecord } from './UserRecord';

export type TaskPayout = {
  symbol: string,
  amount: number, // TODO: should be BigNumber
};

export type TaskFeedItemTypes = 'comment' | 'rating'; // TODO: other item types

export type TaskFeedItemComment = {|
  id: number,
  type: TaskFeedItemTypes,
  user: UserRecord,
  body: string,
  timestamp: Date,
|};

export type TaskFeedItemRating = {|
  id: number,
  type: TaskFeedItemTypes,
  rater: UserRecord,
  ratee: UserRecord,
  rating: number,
  timestamp: Date,
|};

export type TaskFeedItem = TaskFeedItemComment | TaskFeedItemRating;

export type TaskProps = {
  id: number,
  title: string,
  reputation: number, // TODO: should be BigNumber
  payouts: Array<TaskPayout>,
  creator: string,
  assignee: UserRecord,
  feedItems: Array<TaskFeedItem>,
};

export type TaskRecord = RecordOf<TaskProps>;
