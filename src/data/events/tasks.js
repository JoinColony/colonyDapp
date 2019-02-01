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

export const createDueDateSetEvent: EventCreator<
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

export const createSkillSetSetEvent: EventCreator<
  SkillSetEventArgs,
  SkillSetEvent,
> = ({ skillId }) => ({
  type: SKILL_SET,
  payload: decoratePayload<SkillSetEventPayload>({ skillId }),
});
