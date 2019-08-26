import { $Keys } from 'utility-types';

import { RecordOf, Record, List, Set as ImmutableSet } from 'immutable';

import { TASK_STATE } from './constants';

// eslint-disable-next-line import/no-cycle
import { Address } from '~types/index';
// eslint-disable-next-line import/no-cycle
import { TaskPayoutRecordType, TaskPayoutType } from './TaskPayout';

export type TaskCurrentState = $Keys<typeof TASK_STATE>;

/**
 * @todo Support full task workflow for ratings
 * @todo Support full task workflow for specificationHash
 * @todo Support full task workflow for reputation
 * @todo Support full task workflow for taskId
 * @todo Support full task workflow for evaluator
 */
interface Shared {
  colonyAddress: Address;
  createdAt: Date;
  creatorAddress: string; // Address of the task creator
  currentState: TaskCurrentState;
  description?: string;
  domainId?: number;
  draftId: string; // Draft task ID, when the task is a little babby
  dueDate?: Date;
  managerAddress: Address;
  reputation: number;
  skillId?: number;
  title?: string;
  workerAddress: Address;
  // specificationHash?: string,
  // taskId?: number, // On-chain ID, when the task is all grown up :'-)
}

export interface TaskType extends Shared {
  invites: Address[];
  payouts: TaskPayoutType[];
  requests: Address[];
}

interface TaskRecordProps extends Shared {
  invites: ImmutableSet<Address>;
  payouts: List<TaskPayoutRecordType>;
  requests: ImmutableSet<Address>;
}

export type TaskProps<T extends keyof TaskType> = Pick<TaskType, T>;

export type TaskRecordType = RecordOf<TaskRecordProps>;

export type TaskDraftId = TaskRecordType['draftId'];

const defaultValues: TaskRecordProps = {
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

export const TaskRecord: Record.Factory<TaskRecordProps> = Record(
  defaultValues,
);

export default TaskRecord;
