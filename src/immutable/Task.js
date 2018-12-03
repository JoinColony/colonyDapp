/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import { TASK_STATE } from './constants';

import type { ENSName } from '~types';
import type { TaskFeedItemRecord } from './TaskFeedItem';
import type { TaskPayoutRecord } from './TaskPayout';
import type { UserRecord } from './User';

export type TaskRating = 1 | 2 | 3;

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

export type TaskProps = {
  assignee?: UserRecord,
  colonyENSName: ENSName,
  creator: string,
  currentState: TaskCurrentState,
  dueDate?: Date,
  evaluatorHasRated: boolean, // secret was submitted
  evaluatorPayoutClaimed: boolean,
  evaluatorRateFail: boolean, // if they didn't rate or reveal
  feedItems: List<TaskFeedItemRecord>,
  id: number,
  managerHasRated: boolean, // secret was submitted
  managerPayoutClaimed: boolean,
  managerRateFail: boolean, // // if they didn't rate or reveal
  managerRating?: TaskRating,
  payouts: List<TaskPayoutRecord>,
  reputation: number, // TODO: should be BigNumber
  title: string,
  workerHasRated: boolean, // secret was submitted
  workerPayoutClaimed: boolean,
  workerRateFail: boolean, // if they didn't rate or reveal
  workerRating?: TaskRating,
};

export type TaskRecord = RecordOf<TaskProps>;

const defaultValues: TaskProps = {
  assignee: undefined,
  colonyENSName: '',
  creator: '',
  currentState: TASK_STATE.ACTIVE,
  dueDate: undefined,
  evaluatorHasRated: false,
  evaluatorPayoutClaimed: false,
  evaluatorRateFail: false,
  feedItems: new List(),
  id: 0,
  managerHasRated: false,
  managerPayoutClaimed: false,
  managerRateFail: false,
  managerRating: undefined,
  payouts: new List(),
  reputation: 0,
  title: '',
  workerHasRated: false,
  workerPayoutClaimed: false,
  workerRateFail: false,
  workerRating: undefined,
};

// TODO: validate required props, rather than above defaults
const Task: RecordFactory<TaskProps> = Record(defaultValues);

export default Task;
