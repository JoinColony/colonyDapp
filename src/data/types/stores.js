/* @flow */

import type { EventStore, ValidatedKVStore } from '~lib/database/stores';
import type { UserProfileStoreValues } from '~data/storeValuesTypes';

export type ColonyStore = EventStore;
export type CommentsStore = EventStore;
export type TaskStore = EventStore;
export type UserInboxStore = EventStore;
export type UserMetadataStore = EventStore;
export type UserProfileStore = ValidatedKVStore<UserProfileStoreValues>;
