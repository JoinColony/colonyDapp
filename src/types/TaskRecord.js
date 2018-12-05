/* @flow */

import type { RecordOf } from 'immutable';
import type { UserRecord } from './UserRecord';
import type { AddressOrENSName } from '../lib/ColonyManager/types';

import { TASK_STATE } from '../modules/dashboard/records';

export type TaskPayout = {
  symbol: string,
  amount: number, // TODO: should be BigNumber
  isNative?: boolean,
  isEth?: boolean,
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

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

export type TaskRating = 1 | 2 | 3;

export type TaskProps = {
  id: number,
  title: string,
  dueDate?: Date,
  reputation: number, // TODO: should be BigNumber
  payouts: Array<TaskPayout>,
  colonyIdentifier: AddressOrENSName,
  creator: string,
  assignee?: UserRecord,
  feedItems: Array<TaskFeedItem>,
  currentState: TaskCurrentState,
  workerHasRated: boolean, // secret was submitted
  workerRateFail: boolean, // if they didn't rate or reveal
  evaluatorHasRated: boolean,
  evaluatorRateFail: boolean,
  workerRating?: TaskRating, // rating given to worker
  managerRating?: TaskRating, // rating given to manager
  workerPayoutClaimed: boolean,
  managerPayoutClaimed: boolean,
  evaluatorPayoutClaimed: boolean,
};

export type TaskRecord = RecordOf<TaskProps>;
