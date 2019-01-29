/* @flow */

import type {
  EventCreator,
  CommentStoreCreatedEventArgs,
  CommentStoreCreatedEventPayload,
  DueDateSetEventArgs,
  DueDateSetEventPayload,
  DraftCreatedEventArgs,
  DraftCreatedEventPayload,
  DraftUpdatedEventArgs,
  DraftUpdatedEventPayload,
  SkillSetEventArgs,
  SkillSetEventPayload,
} from './types';

import { decoratePayload } from './utils';
import { TASK_EVENT_TYPES } from '../constants';

const {
  COMMENT_STORE_CREATED,
  DRAFT_CREATED,
  DRAFT_UPDATED,
  DUE_DATE_SET,
  SKILL_SET,
} = TASK_EVENT_TYPES;

// @TODO add payload validation here like we had in beta events
export const createCommentStoreCreatedEvent: EventCreator<
  CommentStoreCreatedEventArgs,
  CommentStoreCreatedEventPayload,
> = ({ commentsStoreAddress, taskId }) => ({
  type: COMMENT_STORE_CREATED,
  payload: decoratePayload<CommentStoreCreatedEventPayload>({
    commentsStoreAddress,
    taskId,
  }),
});

export const createDueDateSetEvent: EventCreator<
  DueDateSetEventArgs,
  DueDateSetEventPayload,
> = ({ dueDate, taskId }) => ({
  type: DUE_DATE_SET,
  payload: decoratePayload<DueDateSetEventPayload>({ dueDate, taskId }),
});

export const createDraftCreatedEvent: EventCreator<
  DraftCreatedEventArgs,
  DraftCreatedEventPayload,
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
  DraftUpdatedEventPayload,
> = ({ domainId, meta, specificationHash, title }) => ({
  type: DRAFT_UPDATED,
  payload: decoratePayload<DraftUpdatedEventPayload>({
    domainId,
    meta,
    specificationHash,
    title,
  }),
});

export const createSkillSetSetEvent: EventCreator<
  SkillSetEventArgs,
  SkillSetEventPayload,
> = ({ skillId, taskId }) => ({
  type: SKILL_SET,
  payload: decoratePayload<SkillSetEventPayload>({ skillId, taskId }),
});
