import { Record, List, Set as ImmutableSet } from 'immutable';

import { TaskStates } from '~data/constants';
import { Address, DefaultValues } from '~types/index';
import { TaskPayoutRecord, TaskPayoutType } from './TaskPayout';

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
  currentState: TaskStates;
  description?: string;
  domainId: number;
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
  payouts: List<TaskPayoutRecord>;
  requests: ImmutableSet<Address>;
}

export type TaskProps<T extends keyof TaskType> = Pick<TaskType, T>;

export type TaskDraftId = Shared['draftId'];

const defaultValues: DefaultValues<TaskRecordProps> = {
  colonyAddress: undefined,
  createdAt: new Date(),
  creatorAddress: undefined,
  currentState: TaskStates.ACTIVE,
  description: undefined,
  domainId: undefined,
  draftId: undefined,
  dueDate: undefined,
  invites: ImmutableSet(),
  managerAddress: undefined,
  payouts: List(),
  reputation: 0,
  requests: ImmutableSet(),
  skillId: undefined,
  title: undefined,
  workerAddress: undefined,
};

export class TaskRecord extends Record<TaskRecordProps>(defaultValues) {}

export const Task = (p: TaskRecordProps) => new TaskRecord(p);
