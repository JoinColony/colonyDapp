/* @flow */

import { createEventCreator } from '~data/utils';
import { COLONY_EVENT_TYPES } from '~data/constants';

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
>(DOMAIN_CREATED);

export const createTaskStoreRegisteredEvent = createEventCreator<
  typeof TASK_STORE_REGISTERED,
>(TASK_STORE_REGISTERED);

export const createTaskStoreUnregisteredEvent = createEventCreator<
  typeof TASK_STORE_UNREGISTERED,
>(TASK_STORE_UNREGISTERED);

export const createColonyAvatarRemovedEvent = createEventCreator<
  typeof AVATAR_REMOVED,
>(AVATAR_REMOVED);

export const createColonyAvatarUploadedEvent = createEventCreator<
  typeof AVATAR_UPLOADED,
>(AVATAR_UPLOADED);

export const createColonyProfileCreatedEvent = createEventCreator<
  typeof PROFILE_CREATED,
>(PROFILE_CREATED);

export const createColonyProfileUpdatedEvent = createEventCreator<
  typeof PROFILE_UPDATED,
>(PROFILE_UPDATED);

export const createTokenInfoAddedEvent = createEventCreator<
  typeof TOKEN_INFO_ADDED,
>(TOKEN_INFO_ADDED);
