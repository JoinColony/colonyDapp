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
  CreateTaskStoreRegisteredEventSchema,
  CreateTaskStoreUnregisteredEventSchema,
  CreateTokenInfoAddedEventSchema,
} from './schemas';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_CREATED,
  PROFILE_UPDATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
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

export type TaskStoreRegisteredArgs = {|
  taskStoreAddress: string,
  taskId: string,
  domainId: number,
|};
export type TaskStoreRegisteredPayload = TaskStoreRegisteredArgs;
export type TaskStoreRegistered = Event<
  typeof TASK_STORE_REGISTERED,
  TaskStoreRegisteredPayload,
>;
export type TaskStoreUnregistered = Event<
  typeof TASK_STORE_UNREGISTERED,
  TaskStoreRegisteredPayload,
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
  isNative?: ?boolean,
  address: Address,
  icon?: ?string,
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

export const createTaskStoreRegisteredEvent = createEventCreator<
  typeof TASK_STORE_REGISTERED,
  TaskStoreRegisteredArgs,
  TaskStoreRegistered,
>(TASK_STORE_REGISTERED, CreateTaskStoreRegisteredEventSchema);

export const createTaskStoreUnregisteredEvent = createEventCreator<
  typeof TASK_STORE_UNREGISTERED,
  TaskStoreRegisteredArgs,
  TaskStoreUnregistered,
>(TASK_STORE_UNREGISTERED, CreateTaskStoreUnregisteredEventSchema);

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
