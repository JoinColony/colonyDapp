/* @flow */

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

export const createDomainCreatedEvent = createEventCreator<
  typeof DOMAIN_CREATED,
>(DOMAIN_CREATED, CreateDomainCreatedEventSchema);

export const createTaskStoreRegisteredEvent = createEventCreator<
  typeof TASK_STORE_REGISTERED,
>(TASK_STORE_REGISTERED, CreateTaskStoreRegisteredEventSchema);

export const createTaskStoreUnregisteredEvent = createEventCreator<
  typeof TASK_STORE_UNREGISTERED,
>(TASK_STORE_UNREGISTERED, CreateTaskStoreUnregisteredEventSchema);

export const createColonyAvatarRemovedEvent = createEventCreator<
  typeof AVATAR_REMOVED,
>(AVATAR_REMOVED, CreateColonyAvatarRemovedEventSchema);

export const createColonyAvatarUploadedEvent = createEventCreator<
  typeof AVATAR_UPLOADED,
>(AVATAR_UPLOADED, CreateColonyAvatarUploadedEventSchema);

export const createColonyProfileCreatedEvent = createEventCreator<
  typeof PROFILE_CREATED,
>(PROFILE_CREATED, CreateColonyProfileCreatedEventSchema);

export const createColonyProfileUpdatedEvent = createEventCreator<
  typeof PROFILE_UPDATED,
>(PROFILE_UPDATED, CreateColonyProfileUpdatedEventSchema);

export const createTokenInfoAddedEvent = createEventCreator<
  typeof TOKEN_INFO_ADDED,
>(TOKEN_INFO_ADDED, CreateTokenInfoAddedEventSchema);
