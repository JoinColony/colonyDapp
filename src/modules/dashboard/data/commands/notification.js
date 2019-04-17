/* @flow */
import type { EventStore } from '~lib/database/stores';
import type { UserInboxCommand } from '~data/types';

import { getUserInboxStore } from '~data/stores';

import {
  createColonyCreatedEvent,
  createTokenCreatedEvent,
  createColonyLabelCreatedEvent,
  createColonyAdminAddedEvent,
  createColonyAdminRemovedEvent,
  createColonyDomainCreatedEvent,
} from '../events';

export const createColony: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createColonyCreatedEvent(args));
    return userInboxStore;
  },
});

export const createToken: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createTokenCreatedEvent(args));
    return userInboxStore;
  },
});

export const createColonyLabel: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createColonyLabelCreatedEvent(args));
    return userInboxStore;
  },
});

export const addAdmin: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createColonyAdminAddedEvent(args));
    return userInboxStore;
  },
});

export const removeAdmin: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createColonyAdminRemovedEvent(args));
    return userInboxStore;
  },
});

/*
 * @NOTE This breaks naming convention by appending `Notification` afther the function's name
 * This is because there's already a `createDomain` method in the colony commands
 */
export const createDomainNotification: UserInboxCommand<*, EventStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createColonyDomainCreatedEvent(args));
    return userInboxStore;
  },
});
