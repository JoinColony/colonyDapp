/* @flow */

import type { Event, EventCreator, EventPayload } from './types';

import { decoratePayload } from './utils';
import { TASK_EVENT_TYPES } from '../constants';

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

type CommentStoreCreatedEventArgs = {|
  commentsStoreAddress: string,
|};
type CommentStoreCreatedEventPayload = EventPayload &
  CommentStoreCreatedEventArgs;
type CommentStoreCreatedEvent = Event<
  typeof COMMENT_STORE_CREATED,
  CommentStoreCreatedEventPayload,
>;

type DueDateSetEventArgs = {|
  dueDate: number,
|};
type DueDateSetEventPayload = EventPayload & DueDateSetEventArgs;
type DueDateSetEvent = Event<typeof DUE_DATE_SET, DueDateSetEventPayload>;

type SkillSetEventArgs = {|
  skillId: string,
|};
type SkillSetEventPayload = EventPayload & SkillSetEventArgs;
type SkillSetEvent = Event<typeof SKILL_SET, SkillSetEventPayload>;

type DraftCreatedEventArgs = {|
  draftId: string,
  creator: string,
  domainId: number,
  meta: string,
  specificationHash: string,
  title: string,
|};
type DraftCreatedEventPayload = EventPayload & DraftCreatedEventArgs;
type DraftCreatedEvent = Event<typeof DRAFT_CREATED, DraftCreatedEventPayload>;

type DraftUpdatedEventArgs = {|
  meta: string,
  specificationHash: string,
  title: string,
|};
type DraftUpdatedEventPayload = EventPayload & DraftUpdatedEventArgs;
type DraftUpdatedEvent = Event<typeof DRAFT_UPDATED, DraftUpdatedEventPayload>;

type WorkInviteSentEventArgs = {|
  creator: string,
  worker: string,
|};
type WorkInviteSentEventPayload = EventPayload & WorkInviteSentEventArgs;
type WorkInviteSentEvent = Event<
  typeof WORK_INVITE_SENT,
  WorkInviteSentEventPayload,
>;

type WorkRequestCreatedEventArgs = {|
  worker: string,
|};
type WorkRequestCreatedEventPayload = EventPayload &
  WorkRequestCreatedEventArgs;
type WorkRequestCreatedEvent = Event<
  typeof WORK_REQUEST_CREATED,
  WorkRequestCreatedEventPayload,
>;

type CommentPostedEventArgs = {|
  comment: {|
    signature: string,
    content: {|
      id: string,
      body: string,
      timestamp: number,
      metadata?: {|
        mentions: string[],
      |},
    |},
  |},
|};
type CommentPostedEventPayload = EventPayload & CommentPostedEventArgs;
type CommentPostedEvent = Event<
  typeof COMMENT_POSTED,
  CommentPostedEventPayload,
>;

// @TODO add payload validation here like we had in beta events
export const createCommentStoreCreatedEvent: EventCreator<
  CommentStoreCreatedEventArgs,
  CommentStoreCreatedEvent,
> = ({ commentsStoreAddress }) => ({
  type: COMMENT_STORE_CREATED,
  payload: decoratePayload<CommentStoreCreatedEventPayload>({
    commentsStoreAddress,
  }),
});

export const createTaskDueDateSetEvent: EventCreator<
  DueDateSetEventArgs,
  DueDateSetEvent,
> = ({ dueDate }) => ({
  type: DUE_DATE_SET,
  payload: decoratePayload<DueDateSetEventPayload>({ dueDate }),
});

export const createDraftCreatedEvent: EventCreator<
  DraftCreatedEventArgs,
  DraftCreatedEvent,
> = ({ draftId, creator, domainId, meta, specificationHash, title }) => ({
  type: DRAFT_CREATED,
  payload: decoratePayload<DraftCreatedEventPayload>({
    draftId,
    creator,
    domainId,
    meta,
    specificationHash,
    title,
  }),
});

export const createDraftUpdatedEvent: EventCreator<
  DraftUpdatedEventArgs,
  DraftUpdatedEvent,
> = ({ meta, specificationHash, title }) => ({
  type: DRAFT_UPDATED,
  payload: decoratePayload<DraftUpdatedEventPayload>({
    meta,
    specificationHash,
    title,
  }),
});

export const createTaskSkillSetEvent: EventCreator<
  SkillSetEventArgs,
  SkillSetEvent,
> = ({ skillId }) => ({
  type: SKILL_SET,
  payload: decoratePayload<SkillSetEventPayload>({ skillId }),
});

export const createWorkInviteSentEvent: EventCreator<
  WorkInviteSentEventArgs,
  WorkInviteSentEvent,
> = ({ worker, creator }) => ({
  type: WORK_INVITE_SENT,
  payload: decoratePayload<WorkInviteSentEventPayload>({ worker, creator }),
});

export const createWorkRequestCreatedEvent: EventCreator<
  WorkRequestCreatedEventArgs,
  WorkRequestCreatedEvent,
> = ({ worker }) => ({
  type: WORK_REQUEST_CREATED,
  payload: decoratePayload<WorkRequestCreatedEventPayload>({ worker }),
});

export const createCommentPostedEvent: EventCreator<
  CommentPostedEventArgs,
  CommentPostedEvent,
> = ({ comment }) => ({
  type: COMMENT_POSTED,
  payload: decoratePayload<CommentPostedEventPayload>({ comment }),
});
