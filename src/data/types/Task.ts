/* This file is part of the new data refactoring. do not delete! */
// Eventually we want to auto-generate this file from graphql models

import { User } from './User';

type Stub = any;
type Colony = Stub;
type TaskPayout = Stub;

export interface Task {
  id: string;
  assignedWorker?: User;
  cancelledAt?: number;
  colony?: Colony;
  creator?: User;
  description?: string;
  dueDate?: number;
  ethDomainId?: number;
  ethSkillId?: number;
  ethTaskId?: number;
  finalizedAt?: number;
  payouts?: TaskPayout[];
  title?: string;
  workInvites: User[];
  workRequests: User[];
}

export type TaskProps<T extends keyof Task> = Pick<Task, T>;

export type TaskDraftId = Task['id'];

export interface TaskQueryVariables {
  id: TaskDraftId;
}
