/* @flow */

import type { Event, EventCreator, EventPayload } from '../../types';

import { decoratePayload } from '../../utils';
import { TASK_EVENT_TYPES } from '../../constants';

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
export type CommentStoreCreatedEventPayload = EventPayload &
  CommentStoreCreatedEventArgs;
export type CommentStoreCreatedEvent = Event<
  typeof COMMENT_STORE_CREATED,
  CommentStoreCreatedEventPayload,
>;

export type DueDateSetEventArgs = {|
  dueDate: number,
|};
export type DueDateSetEventPayload = EventPayload & DueDateSetEventArgs;
export type DueDateSetEvent = Event<
  typeof DUE_DATE_SET,
  DueDateSetEventPayload,
>;

export type SkillSetEventArgs = {|
  skillId: string,
|};
export type SkillSetEventPayload = EventPayload & SkillSetEventArgs;
export type SkillSetEvent = Event<typeof SKILL_SET, SkillSetEventPayload>;

export type DraftCreatedEventArgs = {|
  draftId: string,
  creator: string,
  domainId: number,
  meta: string,
  specificationHash: string,
  title: string,
|};
export type DraftCreatedEventPayload = EventPayload & DraftCreatedEventArgs;
export type DraftCreatedEvent = Event<
  typeof DRAFT_CREATED,
  DraftCreatedEventPayload,
>;

export type DraftUpdatedEventArgs = {|
  meta: string,
  specificationHash: string,
  title: string,
|};
export type DraftUpdatedEventPayload = EventPayload & DraftUpdatedEventArgs;
export type DraftUpdatedEvent = Event<
  typeof DRAFT_UPDATED,
  DraftUpdatedEventPayload,
>;

export type WorkInviteSentEventArgs = {|
  creator: string,
  worker: string,
|};
export type WorkInviteSentEventPayload = EventPayload & WorkInviteSentEventArgs;
export type WorkInviteSentEvent = Event<
  typeof WORK_INVITE_SENT,
  WorkInviteSentEventPayload,
>;

export type WorkRequestCreatedEventArgs = {|
  worker: string,
|};
export type WorkRequestCreatedEventPayload = EventPayload &
  WorkRequestCreatedEventArgs;
export type WorkRequestCreatedEvent = Event<
  typeof WORK_REQUEST_CREATED,
  WorkRequestCreatedEventPayload,
>;

export type CommentPostedEventArgs = {|
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
export type CommentPostedEventPayload = EventPayload & CommentPostedEventArgs;
export type CommentPostedEvent = Event<
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
