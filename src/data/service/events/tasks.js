/* @flow */

import type { Address } from '~types';
import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { TASK_EVENT_TYPES, TASK_STATUS } from '../../constants';
import {
  CreateCommentPostedEventSchema,
  CreateCommentStoreCreatedEventSchema,
  CreateTaskCreatedEventSchema,
  CreateTaskUpdatedEventSchema,
  CreateDueDateSetEventSchema,
  CreateSkillSetEventSchema,
  WorkerAssignmentEventSchema,
  CreateBountySetEventSchema,
  CreateDomainSetEventSchema,
  CreateTaskFinalizedEventSchema,
} from './schemas';

const {
  COMMENT_STORE_CREATED,
  TASK_CREATED,
  TASK_UPDATED,
  DUE_DATE_SET,
  SKILL_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  COMMENT_POSTED,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_FINALIZED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
  BOUNTY_SET,
  DOMAIN_SET,
} = TASK_EVENT_TYPES;

export type CommentStoreCreatedEventArgs = {|
  commentsStoreAddress: string,
|};
export type CommentStoreCreatedEventPayload = CommentStoreCreatedEventArgs;
export type CommentStoreCreatedEvent = Event<
  typeof COMMENT_STORE_CREATED,
  CommentStoreCreatedEventPayload,
>;

export type DueDateSetEventArgs = {|
  dueDate: number,
|};
export type DueDateSetEventPayload = DueDateSetEventArgs;
export type DueDateSetEvent = Event<
  typeof DUE_DATE_SET,
  DueDateSetEventPayload,
>;

export type SkillSetEventArgs = {|
  skillId: number,
|};
export type SkillSetEventPayload = SkillSetEventArgs;
export type SkillSetEvent = Event<typeof SKILL_SET, SkillSetEventPayload>;

export type TaskCreatedEventArgs = {|
  domainId: number,
  taskId: string,
  description: string,
  title: string,
|};
export type TaskCreatedEventPayload = TaskCreatedEventArgs;
export type TaskCreatedEvent = Event<
  typeof TASK_CREATED,
  TaskCreatedEventPayload,
>;

export type TaskUpdatedEventArgs = {|
  description: string,
  title: string,
|};
export type TaskUpdatedEventPayload = TaskUpdatedEventArgs;
export type TaskUpdatedEvent = Event<
  typeof TASK_UPDATED,
  TaskUpdatedEventPayload,
>;

export type WorkInviteSentEventArgs = {|
  worker: string,
|};
export type WorkInviteSentEventPayload = WorkInviteSentEventArgs;
export type WorkInviteSentEvent = Event<
  typeof WORK_INVITE_SENT,
  WorkInviteSentEventPayload,
>;

export type WorkRequestCreatedEventArgs = {|
  worker: string,
|};
export type WorkRequestCreatedEventPayload = WorkRequestCreatedEventArgs;
export type WorkRequestCreatedEvent = Event<
  typeof WORK_REQUEST_CREATED,
  WorkRequestCreatedEventPayload,
>;

export type CommentPostedEventArgs = {|
  signature: string,
  content: {|
    id: string,
    author: Address,
    body: string,
    timestamp: number,
    metadata?: {|
      mentions: string[],
    |},
  |},
|};
export type CommentPostedEventPayload = CommentPostedEventArgs;
export type CommentPostedEvent = Event<
  typeof COMMENT_POSTED,
  CommentPostedEventPayload,
>;

export type TaskCancelledEventArgs = {|
  status: typeof TASK_STATUS.CANCELLED,
|};
export type TaskCancelledEventPayload = TaskCancelledEventArgs;
export type TaskCancelledEvent = Event<
  typeof TASK_CANCELLED,
  TaskCancelledEventPayload,
>;

export type TaskClosedEventArgs = {|
  status: typeof TASK_STATUS.CLOSED,
|};
export type TaskClosedEventPayload = TaskClosedEventArgs;
export type TaskClosedEvent = Event<typeof TASK_CLOSED, TaskClosedEventPayload>;

export type TaskFinalizedEventArgs = {|
  status: typeof TASK_STATUS.FINALIZED,
  worker: Address,
  amountPaid: string,
  token?: Address,
  paymentId?: number,
|};
export type TaskFinalizedEventPayload = TaskFinalizedEventArgs;
export type TaskFinalizedEvent = Event<
  typeof TASK_FINALIZED,
  TaskFinalizedEventPayload,
>;

export type WorkerAssignedEventArgs = {|
  worker: Address,
|};
export type WorkerAssignedEventPayload = WorkerAssignedEventArgs;
export type WorkerAssignedEvent = Event<
  typeof WORKER_ASSIGNED,
  WorkerAssignedEventPayload,
>;

export type WorkerUnassignedEventArgs = {|
  worker: Address,
|};
export type WorkerUnassignedEventPayload = WorkerUnassignedEventArgs;
export type WorkerUnassignedEvent = Event<
  typeof WORKER_UNASSIGNED,
  WorkerUnassignedEventPayload,
>;

export type BountySetEventArgs = {|
  amount: string,
  token?: ?string,
|};
export type BountySetEventPayload = BountySetEventArgs;
export type BountySetEvent = Event<typeof BOUNTY_SET, BountySetEventPayload>;

export type DomainSetEventArgs = {|
  domainId: number,
|};
export type DomainSetEventPayload = DomainSetEventArgs;
export type DomainSetEvent = Event<typeof DOMAIN_SET, DomainSetEventPayload>;

export const createCommentStoreCreatedEvent = createEventCreator<
  typeof COMMENT_STORE_CREATED,
  CommentStoreCreatedEventArgs,
  CommentStoreCreatedEvent,
>(COMMENT_STORE_CREATED, CreateCommentStoreCreatedEventSchema);

export const createTaskDueDateSetEvent = createEventCreator<
  typeof DUE_DATE_SET,
  DueDateSetEventArgs,
  DueDateSetEvent,
>(DUE_DATE_SET, CreateDueDateSetEventSchema);

export const createTaskCreatedEvent = createEventCreator<
  typeof TASK_CREATED,
  TaskCreatedEventArgs,
  TaskCreatedEvent,
>(TASK_CREATED, CreateTaskCreatedEventSchema);

export const createTaskUpdatedEvent = createEventCreator<
  typeof TASK_UPDATED,
  TaskUpdatedEventArgs,
  TaskUpdatedEvent,
>(TASK_UPDATED, CreateTaskUpdatedEventSchema);

export const createTaskSkillSetEvent = createEventCreator<
  typeof SKILL_SET,
  SkillSetEventArgs,
  SkillSetEvent,
>(SKILL_SET, CreateSkillSetEventSchema);

export const createWorkInviteSentEvent = createEventCreator<
  typeof WORK_INVITE_SENT,
  WorkInviteSentEventArgs,
  WorkInviteSentEvent,
>(WORK_INVITE_SENT, WorkerAssignmentEventSchema);

export const createWorkRequestCreatedEvent = createEventCreator<
  typeof WORK_REQUEST_CREATED,
  WorkRequestCreatedEventArgs,
  WorkRequestCreatedEvent,
>(WORK_REQUEST_CREATED, WorkerAssignmentEventSchema);

export const createCommentPostedEvent = createEventCreator<
  typeof COMMENT_POSTED,
  CommentPostedEventArgs,
  CommentPostedEvent,
>(COMMENT_POSTED, CreateCommentPostedEventSchema);

export const createWorkerAssignedEvent = createEventCreator<
  typeof WORKER_ASSIGNED,
  WorkerAssignedEventArgs,
  WorkerAssignedEvent,
>(WORKER_ASSIGNED, WorkerAssignmentEventSchema);

export const createWorkerUnassignedEvent = createEventCreator<
  typeof WORKER_UNASSIGNED,
  WorkerUnassignedEventArgs,
  WorkerUnassignedEvent,
>(WORKER_UNASSIGNED, WorkerAssignmentEventSchema);

export const createTaskBountySetEvent = createEventCreator<
  typeof BOUNTY_SET,
  BountySetEventArgs,
  BountySetEvent,
>(BOUNTY_SET, CreateBountySetEventSchema);

export const createTaskCancelledEvent = createEventCreator<
  typeof TASK_CANCELLED,
  TaskCancelledEventArgs,
  TaskCancelledEvent,
>(TASK_CANCELLED);

export const createTaskClosedEvent = createEventCreator<
  typeof TASK_CLOSED,
  TaskClosedEventArgs,
  TaskClosedEvent,
>(TASK_CLOSED);

export const createTaskFinalizedEvent = createEventCreator<
  typeof TASK_FINALIZED,
  TaskFinalizedEventArgs,
  TaskFinalizedEvent,
>(TASK_FINALIZED, CreateTaskFinalizedEventSchema);

export const createTaskDomainSetEvent = createEventCreator<
  typeof DOMAIN_SET,
  DomainSetEventArgs,
  DomainSetEvent,
>(DOMAIN_SET, CreateDomainSetEventSchema);
