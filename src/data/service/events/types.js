/* @flow */

import type { Address } from '~types';

export type EventPayload = {
  id: string,
  timestamp: number,
  version: number,
};

export type Event<P: EventPayload> = {
  type: string,
  payload: P,
};

export type EventCreator<I: Object, O: Object> = (args: I) => Event<O>;

export type CommentStoreCreatedEventArgs = {
  commentsStoreAddress: string,
  draftId: string,
};

export type CommentStoreCreatedEventPayload = EventPayload &
  CommentStoreCreatedEventArgs;

export type DueDateSetEventArgs = {
  dueDate: number,
  draftId: string,
};

export type DueDateSetEventPayload = EventPayload & DueDateSetEventArgs;

export type SkillSetEventArgs = {
  skillId: string,
  draftId: string,
};

export type SkillSetEventPayload = EventPayload & SkillSetEventArgs;

export type DraftCreatedEventArgs = {
  draftId: string,
  creator: string,
  domainId: number,
  meta: string,
  specificationHash: string,
  title: string,
};

export type DraftCreatedEventPayload = EventPayload & DraftCreatedEventArgs;

export type DraftUpdatedEventArgs = {
  meta: string,
  specificationHash: string,
  title: string,
};

export type DraftUpdatedEventPayload = EventPayload & DraftUpdatedEventArgs;

export type DomainCreatedEventArgs = {
  domainId: string,
  colonyENSName: string,
};

export type DomainCreatedEventPayload = EventPayload & DomainCreatedEventArgs;

export type TaskStoreCreatedEventArgs = {
  taskStoreAddress: string,
  draftId: string,
  domainId: string,
};

export type TaskStoreCreatedEventPayload = EventPayload &
  TaskStoreCreatedEventArgs;

export type ColonyAvatarUploadedEventArgs = {
  ipfsHash: string,
  avatar: string,
};

export type ColonyAvatarUploadedEventPayload = EventPayload &
  ColonyAvatarUploadedEventArgs;

export type ColonyAvatarRemovedEventArgs = {
  ipfsHash: string,
};

export type ColonyAvatarRemovedEventPayload = EventPayload &
  ColonyAvatarRemovedEventArgs;

export type TokenInfoAddedEventArgs = {
  address: Address,
  icon: string,
  name: string,
  symbol: string,
};

export type TokenInfoAddedEventPayload = EventPayload & TokenInfoAddedEventArgs;

export type ColonyProfileCreatedEventArgs = {
  colonyId: string,
  address: Address,
  ensName: string,
  name: string,
  description: string,
  website: string,
  guideline: string,
};

export type ColonyProfileCreatedEventPayload = EventPayload &
  ColonyProfileCreatedEventArgs;

export type ColonyProfileUpdatedEventArgs = {
  description: string,
  website: string,
  guideline: string,
};

export type ColonyProfileUpdatedEventPayload = EventPayload &
  ColonyProfileUpdatedEventArgs;

export type NotificationsReadUntilEventArgs = {
  watermark: string,
  exceptFor?: string[],
};

export type NotificationsReadUntilEventPayload = EventPayload &
  ColonyProfileUpdatedEventArgs;
