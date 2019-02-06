/* @flow */

import type { Address } from '~types';
import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { COLONY_EVENT_TYPES } from '../../constants';
import {
  CreateColonyAvatarRemovedEventSchema,
  CreateColonyAvatarUploadedEventSchema,
  CreateColonyProfileCreatedEventSchema,
  CreateColonyProfileUpdatedEventSchema,
  CreateDomainCreatedEventSchema,
  CreateTaskStoreCreatedEventSchema,
  CreateTokenInfoAddedEventSchema,
} from './schemas';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_CREATED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

export type DomainCreatedEventArgs = {|
  domainId: number,
  name: string,
|};
export type DomainCreatedEventPayload = DomainCreatedEventArgs;
export type DomainCreatedEvent = Event<
  typeof DOMAIN_CREATED,
  DomainCreatedEventPayload,
>;

export type TaskStoreCreatedEventArgs = {|
  taskStoreAddress: string,
  draftId: string,
  domainId: number,
|};
export type TaskStoreCreatedEventPayload = TaskStoreCreatedEventArgs;
export type TaskStoreCreatedEvent = Event<
  typeof TASK_STORE_CREATED,
  TaskStoreCreatedEventPayload,
>;

export type ColonyAvatarUploadedEventArgs = {|
  ipfsHash: string,
  avatar: string,
|};
export type ColonyAvatarUploadedEventPayload = ColonyAvatarUploadedEventArgs;
export type ColonyAvatarUploadedEvent = Event<
  typeof AVATAR_UPLOADED,
  ColonyAvatarUploadedEventPayload,
>;

export type ColonyAvatarRemovedEventArgs = {|
  ipfsHash: string,
|};
export type ColonyAvatarRemovedEventPayload = ColonyAvatarRemovedEventArgs;
export type ColonyAvatarRemovedEvent = Event<
  typeof AVATAR_REMOVED,
  ColonyAvatarRemovedEventPayload,
>;

export type TokenInfoAddedEventArgs = {|
  address: Address,
  icon: string,
  name: string,
  symbol: string,
|};
export type TokenInfoAddedEventPayload = TokenInfoAddedEventArgs;
export type TokenInfoAddedEvent = Event<
  typeof TOKEN_INFO_ADDED,
  TokenInfoAddedEventPayload,
>;

export type ColonyProfileCreatedEventArgs = {|
  address: Address,
  ensName: string,
  name: string,
  description?: string,
  website?: string,
  guideline?: string,
|};
export type ColonyProfileCreatedEventPayload = ColonyProfileCreatedEventArgs;
export type ColonyProfileCreatedEvent = Event<
  typeof PROFILE_CREATED,
  ColonyProfileCreatedEventPayload,
>;

export type ColonyProfileUpdatedEventArgs = $Shape<{|
  name: string,
  description: string,
  website: string,
  guideline: string,
|}>;
export type ColonyProfileUpdatedEventPayload = ColonyProfileUpdatedEventArgs;
export type ColonyProfileUpdatedEvent = Event<
  typeof PROFILE_UPDATED,
  ColonyProfileUpdatedEventPayload,
>;

export const createDomainCreatedEvent = createEventCreator<
  typeof DOMAIN_CREATED,
  DomainCreatedEventArgs,
  DomainCreatedEvent,
>(DOMAIN_CREATED, CreateDomainCreatedEventSchema);

export const createTaskStoreCreatedEvent = createEventCreator<
  typeof TASK_STORE_CREATED,
  TaskStoreCreatedEventArgs,
  TaskStoreCreatedEvent,
>(TASK_STORE_CREATED, CreateTaskStoreCreatedEventSchema);

export const createColonyAvatarRemovedEvent = createEventCreator<
  typeof AVATAR_REMOVED,
  ColonyAvatarRemovedEventArgs,
  ColonyAvatarRemovedEvent,
>(AVATAR_REMOVED, CreateColonyAvatarRemovedEventSchema);

export const createColonyAvatarUploadedEvent = createEventCreator<
  typeof AVATAR_UPLOADED,
  ColonyAvatarUploadedEventArgs,
  ColonyAvatarUploadedEvent,
>(AVATAR_UPLOADED, CreateColonyAvatarUploadedEventSchema);

export const createColonyProfileCreatedEvent = createEventCreator<
  typeof PROFILE_CREATED,
  ColonyProfileCreatedEventArgs,
  ColonyProfileCreatedEvent,
>(PROFILE_CREATED, CreateColonyProfileCreatedEventSchema);

export const createColonyProfileUpdatedEvent = createEventCreator<
  typeof PROFILE_UPDATED,
  ColonyProfileUpdatedEventArgs,
  ColonyProfileUpdatedEvent,
>(PROFILE_UPDATED, CreateColonyProfileUpdatedEventSchema);

export const createTokenInfoAddedEvent = createEventCreator<
  typeof TOKEN_INFO_ADDED,
  TokenInfoAddedEventArgs,
  TokenInfoAddedEvent,
>(TOKEN_INFO_ADDED, CreateTokenInfoAddedEventSchema);
