/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List } from 'immutable';

import { TASK_STATE } from './constants';

import type { $Pick } from '~types';
import type { TaskPayoutRecordType, TaskPayoutType } from './TaskPayout';
import type { TaskUserRecordType, TaskUserType } from './TaskUser';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

// TODO support full task workflow:
// export type TaskRating = 1 | 2 | 3;

type Shared = {|
  colonyENSName: string,
  createdAt: Date,
  creator: string, // Address of the task creator
  currentState: TaskCurrentState,
  description?: string,
  domainId?: number,
  draftId: string, // Draft task ID, when the task is a little babby
  dueDate?: Date,
  reputation: number,
  skillId?: number,
  title?: string,
  // TODO support full task workflow:
  // reputation: number,
  // specificationHash?: string,
  // taskId?: number, // On-chain ID, when the task is all grown up :'-)
|};

export type TaskType = $ReadOnly<{|
  ...Shared,
  manager?: TaskUserType,
  payouts: Array<TaskPayoutType>,
  worker?: TaskUserType,
  // TODO support full task workflow:
  // evaluator?: TaskUserType,
|}>;

type TaskRecordProps = {|
  ...Shared,
  manager?: TaskUserRecordType,
  payouts: List<TaskPayoutRecordType>,
  worker?: TaskUserRecordType,
  // TODO support full task workflow:
  // evaluator?: TaskUserRecordType,
|};

export type TaskProps<T> = $Pick<TaskType, $Exact<T>>;

export type TaskRecordType = RecordOf<TaskRecordProps>;

export type TaskDraftId = $PropertyType<TaskRecordType, 'draftId'>;

// TODO support full task workflow:
// export type TaskId = $PropertyType<TaskRecordType, 'taskId'>;

const defaultValues: $Shape<TaskRecordProps> = {
  colonyENSName: undefined,
  createdAt: undefined,
  creator: undefined,
  currentState: undefined,
  description: undefined,
  domainId: undefined,
  draftId: undefined,
  dueDate: undefined,
  manager: undefined,
  payouts: List(),
  reputation: undefined,
  skillId: undefined,
  title: undefined,
  worker: undefined,
};

const TaskRecord: RecordFactory<TaskRecordProps> = Record(defaultValues);

export default TaskRecord;
