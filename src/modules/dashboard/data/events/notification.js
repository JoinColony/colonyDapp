/* @flow */

import { createEventCreator } from '~data/utils';
import { COLONY_EVENT_TYPES } from '~data/constants';

const {
  COLONY_CREATED,
  TOKEN_CREATED,
  COLONY_LABEL_CREATED,
  ADMIN_ADDED,
  ADMIN_REMOVED,
  DOMAIN_CREATED,
} = COLONY_EVENT_TYPES;

export const createColonyCreatedEvent = createEventCreator<
  typeof COLONY_CREATED,
>(COLONY_CREATED);

export const createTokenCreatedEvent = createEventCreator<typeof TOKEN_CREATED>(
  TOKEN_CREATED,
);

export const createColonyLabelCreatedEvent = createEventCreator<
  typeof COLONY_LABEL_CREATED,
>(COLONY_LABEL_CREATED);

export const createColonyAdminAddedEvent = createEventCreator<
  typeof ADMIN_ADDED,
>(ADMIN_ADDED);

export const createColonyAdminRemovedEvent = createEventCreator<
  typeof ADMIN_REMOVED,
>(ADMIN_REMOVED);

export const createColonyDomainCreatedEvent = createEventCreator<
  typeof DOMAIN_CREATED,
>(DOMAIN_CREATED);
