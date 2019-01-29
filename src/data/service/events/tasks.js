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
import { TASK_EVENT_TYPES } from '../../constants';

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
> = ({ commentsStoreAddress, draftId }) => ({
  type: COMMENT_STORE_CREATED,
  payload: decoratePayload<CommentStoreCreatedEventPayload>({
    commentsStoreAddress,
    draftId,
  }),
});

export const createDueDateSetEvent: EventCreator<
  DueDateSetEventArgs,
  DueDateSetEventPayload,
> = ({ dueDate, draftId }) => ({
  type: DUE_DATE_SET,
  payload: decoratePayload<DueDateSetEventPayload>({ dueDate, draftId }),
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
  SkillSetEventPayload,
> = ({ skillId, draftId }) => ({
  type: SKILL_SET,
  payload: decoratePayload<SkillSetEventPayload>({ skillId, draftId }),
});
