/* @flow */
import type { FeedStore } from '~lib/database/stores';
import type { UserInboxCommand } from '~data/types';

import { getUserInboxStore } from '~data/stores';

import { createColonyCreatedEvent, createTokenCreatedEvent, createColonyLabelCreatedEvent } from '../events';

export const createColony: UserInboxCommand<*, FeedStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.add(createColonyCreatedEvent(args));
    return userInboxStore;
  },
});

export const createToken: UserInboxCommand<*, FeedStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.add(createTokenCreatedEvent(args));
    return userInboxStore;
  },
});

export const createColonyLabel: UserInboxCommand<*, FeedStore> = ({
  ddb,
  metadata,
}) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.add(createColonyLabelCreatedEvent(args));
    return userInboxStore;
  },
});
