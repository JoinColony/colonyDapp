/* @flow */

import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { TASK_EVENT_TYPES } from '../../constants';
import {
  CreateCommentPostedEventSchema,
  CreateCommentStoreCreatedEventSchema,
  CreateDraftCreatedEventSchema,
  CreateDraftUpdatedEventSchema,
  CreateDueDateSetEventSchema,
  CreateSkillSetEventSchema,
  CreateWorkInviteSentEventSchema,
  CreateWorkRequestCreatedEventSchema,
} from './schemas';

const {
  COMMENT_STORE_CREATED,
  DRAFT_CREATED,
  DRAFT_UPDATED,
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

export type DraftCreatedEventArgs = {|
  creator: string,
  domainId: number,
  draftId: string,
  meta: string,
  specificationHash: string,
  title: string,
|};
export type DraftCreatedEventPayload = DraftCreatedEventArgs;
export type DraftCreatedEvent = Event<
  typeof DRAFT_CREATED,
  DraftCreatedEventPayload,
>;

export type DraftUpdatedEventArgs = {|
  meta: string,
  specificationHash: string,
  title: string,
|};
export type DraftUpdatedEventPayload = DraftUpdatedEventArgs;
export type DraftUpdatedEvent = Event<
  typeof DRAFT_UPDATED,
  DraftUpdatedEventPayload,
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

export const createDraftCreatedEvent = createEventCreator<
  typeof DRAFT_CREATED,
  DraftCreatedEventArgs,
  DraftCreatedEvent,
>(DRAFT_CREATED, CreateDraftCreatedEventSchema);

export const createDraftUpdatedEvent = createEventCreator<
  typeof DRAFT_UPDATED,
  DraftUpdatedEventArgs,
  DraftUpdatedEvent,
>(DRAFT_UPDATED, CreateDraftUpdatedEventSchema);

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
