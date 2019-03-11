/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import { TASK_STATE } from './constants';

import type { ENSName, OrbitDBAddress } from '~types';

import type { TaskFeedItemRecordType, TaskFeedItemType } from './TaskFeedItem';
import type { TaskPayoutRecordType, TaskPayoutType } from './TaskPayout';
import type { UserType, UserRecordType } from './User';

export type TaskRating = 1 | 2 | 3;

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

type Shared = {|
  colonyENSName: ENSName,
  creator: string,
  currentState: TaskCurrentState,
  description: string,
  domainId: number,
  draftId: string, // Draft ID, when the task is a little babby
  dueDate?: Date,
  evaluatorHasRated: boolean, // secret was submitted
  evaluatorPayoutClaimed: boolean,
  evaluatorRateFail: boolean, // if they didn't rate or reveal
  managerHasRated: boolean, // secret was submitted
  managerPayoutClaimed: boolean,
  managerRateFail: boolean, // if they didn't rate or reveal
  managerRating?: TaskRating,
  reputation: number, // TODO: should be BigNumber
  skillId: number,
  taskId?: number, // On-chain ID, when the task is all grown up :'-)
  title: string,
  workerHasRated: boolean, // secret was submitted
  workerPayoutClaimed: boolean,
  workerRateFail: boolean, // if they didn't rate or reveal
  workerRating?: TaskRating,
  commentsStoreAddress?: string | OrbitDBAddress,
|};

export type TaskType = $ReadOnly<{|
  ...Shared,
  assignee?: UserType,
  feedItems: Array<TaskFeedItemType>,
  payouts: Array<TaskPayoutType>,
|}>;

type TaskRecordProps = {|
  ...Shared,
  assignee?: UserRecordType,
  feedItems: List<TaskFeedItemRecordType>,
  payouts: List<TaskPayoutRecordType>,
|};

export type TaskRecordType = RecordOf<TaskRecordProps>;

export type TaskDraftId = $PropertyType<TaskRecordType, 'draftId'>;
export type TaskId = $PropertyType<TaskRecordType, 'taskId'>;

const defaultValues: $Shape<TaskRecordProps> = {
  assignee: undefined,
  colonyENSName: undefined,
  creator: undefined,
  currentState: undefined,
  domainId: undefined,
  dueDate: undefined,
  evaluatorHasRated: undefined,
  evaluatorPayoutClaimed: undefined,
  evaluatorRateFail: undefined,
  feedItems: new List(),
  draftId: undefined,
  managerHasRated: undefined,
  managerPayoutClaimed: undefined,
  managerRateFail: undefined,
  managerRating: undefined,
  payouts: new List(),
  reputation: undefined,
  skillId: undefined,
  taskId: undefined,
  title: undefined,
  workerHasRated: undefined,
  workerPayoutClaimed: undefined,
  workerRateFail: undefined,
  workerRating: undefined,
  commentsStoreAddress: undefined,
};

const TaskRecord: RecordFactory<TaskRecordProps> = Record(defaultValues);

export default TaskRecord;
