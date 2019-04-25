/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record, List, Set as ImmutableSet } from 'immutable';

import { TASK_STATE } from './constants';

import type { $Pick, Address } from '~types';
import type { TaskPayoutRecordType, TaskPayoutType } from './TaskPayout';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

/**
 * @todo Support full task workflow for ratings
 */
/**
 * @todo Support full task workflow for specificationHash
 */
/**
 * @todo Support full task workflow for taskId
 */
/**
 * @todo Support full task workflow for reputation
 */
/**
 * @todo Support full task workflow for evaluator
 */
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
  // specificationHash?: string,
  // taskId?: number, // On-chain ID, when the task is all grown up :'-)
|};

export type TaskType = $ReadOnly<{|
  ...Shared,
  invites: Address[],
  payouts: TaskPayoutType[],
  requests: Address[],
|}>;

type TaskRecordProps = {|
  ...Shared,
  invites: ImmutableSet<Address>,
  payouts: List<TaskPayoutRecordType>,
  requests: ImmutableSet<Address>,
|};

export type TaskProps<T> = $Pick<TaskType, $Exact<T>>;

export type TaskRecordType = RecordOf<TaskRecordProps>;

export type TaskDraftId = $PropertyType<TaskRecordType, 'draftId'>;

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
