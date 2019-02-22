/* @flow */

import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { TASK_EVENT_TYPES } from '../../constants';
import {
  CreateCommentPostedEventSchema,
  CreateCommentStoreCreatedEventSchema,
  CreateTaskCreatedEventSchema,
  CreateTaskUpdatedEventSchema,
  CreateDueDateSetEventSchema,
  CreateSkillSetEventSchema,
  CreateWorkInviteSentEventSchema,
  CreateWorkRequestCreatedEventSchema,
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
  skillId: string,
|};
export type SkillSetEventPayload = SkillSetEventArgs;
export type SkillSetEvent = Event<typeof SKILL_SET, SkillSetEventPayload>;

export type TaskCreatedEventArgs = {|
  domainId: number,
  taskId: string,
  specificationHash: string,
  title: string,
|};
export type TaskCreatedEventPayload = TaskCreatedEventArgs;
export type TaskCreatedEvent = Event<
  typeof TASK_CREATED,
  TaskCreatedEventPayload,
>;

export type TaskUpdatedEventArgs = {|
  specificationHash: string,
  title: string,
|};
export type TaskUpdatedEventPayload = TaskUpdatedEventArgs;
export type TaskUpdatedEvent = Event<
  typeof TASK_UPDATED,
  TaskUpdatedEventPayload,
>;

export type WorkInviteSentEventArgs = {|
  creator: string,
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
>(WORK_INVITE_SENT, CreateWorkInviteSentEventSchema);

export const createWorkRequestCreatedEvent = createEventCreator<
  typeof WORK_REQUEST_CREATED,
  WorkRequestCreatedEventArgs,
  WorkRequestCreatedEvent,
>(WORK_REQUEST_CREATED, CreateWorkRequestCreatedEventSchema);

export const createCommentPostedEvent = createEventCreator<
  typeof COMMENT_POSTED,
  CommentPostedEventArgs,
  CommentPostedEvent,
>(COMMENT_POSTED, CreateCommentPostedEventSchema);
