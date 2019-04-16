/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List, Set as ImmutableSet } from 'immutable';

import { TASK_STATE } from './constants';

import type { $Pick, Address } from '~types';
import type { TaskPayoutRecordType, TaskPayoutType } from './TaskPayout';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

// TODO support full task workflow:
// export type TaskRating = 1 | 2 | 3;

type Shared = {|
  colonyAddress: Address,
  createdAt: Date,
  creatorAddress: string, // Address of the task creator
  currentState: TaskCurrentState,
  description?: string,
  domainId?: number,
  draftId: string, // Draft task ID, when the task is a little babby
  dueDate?: Date,
  managerAddress: Address,
  reputation: number,
  skillId?: number,
  title?: string,
  workerAddress: Address,
  // TODO support full task workflow:
  // reputation: number,
  // specificationHash?: string,
  // taskId?: number, // On-chain ID, when the task is all grown up :'-)
|};

export type TaskType = $ReadOnly<{|
  ...Shared,
  invites: Address[],
  payouts: TaskPayoutType[],
  requests: Address[],
  // TODO support full task workflow:
  // evaluator?: TaskUserType,
|}>;

type TaskRecordProps = {|
  ...Shared,
  invites: ImmutableSet<Address>,
  payouts: List<TaskPayoutRecordType>,
  requests: ImmutableSet<Address>,
  // TODO support full task workflow:
  // evaluator?: TaskUserRecordType,
|};

export type TaskProps<T> = $Pick<TaskType, $Exact<T>>;

export type TaskRecordType = RecordOf<TaskRecordProps>;

export type TaskDraftId = $PropertyType<TaskRecordType, 'draftId'>;

// TODO support full task workflow:
// export type TaskId = $PropertyType<TaskRecordType, 'taskId'>;

const defaultValues: $Shape<TaskRecordProps> = {
  colonyAddress: undefined,
  createdAt: undefined,
  creatorAddress: undefined,
  currentState: undefined,
  description: undefined,
  domainId: undefined,
  draftId: undefined,
  dueDate: undefined,
  invites: ImmutableSet(),
  managerAddress: undefined,
  payouts: List(),
  reputation: undefined,
  requests: ImmutableSet(),
  skillId: undefined,
  title: undefined,
  workerAddress: undefined,
};

const TaskRecord: RecordFactory<TaskRecordProps> = Record(defaultValues);

export default TaskRecord;
