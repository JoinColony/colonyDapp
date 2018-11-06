/* @flow */

import type { RecordOf } from 'immutable';
import type { UserRecord } from './UserRecord';

export type TaskPayout = {
  symbol: string,
  amount: number, // TODO: should be BigNumber
};

export type TaskFeedItemTypes = 'comment' | 'rating'; // TODO: other item types

export type TaskFeedItemGeneral = {
  type: string,
};

export type TaskFeedItemComment = TaskFeedItemGeneral & {
  id: number,
  user: UserRecord,
  body: string,
  timestamp: Date,
};

export type TaskFeedItem = TaskFeedItemComment;

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
