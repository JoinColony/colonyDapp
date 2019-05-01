/* @flow */

import type { ObjectSchema } from 'yup';
import type { EventStore } from '~lib/database/stores';
import type { AccessController } from './accessControllers';
import type PurserIdentity from '../PurserIdentity';
import type PurserIdentityProvider from '../PurserIdentityProvider';

/*
 * This perhaps slightly redundant when every store is of the
 * same type, but these could change, and at least we know
 * which store we're dealing with.
 *
 * If we were really clever, we'd consider adding a generic that
 * defines the possible event types for that store.
 */
export type ColonyStore = EventStore;
export type CommentsStore = EventStore;
export type TaskStore = EventStore;
export type UserInboxStore = EventStore;
export type UserMetadataStore = EventStore;
export type UserProfileStore = EventStore;

export type StoreBlueprint<P: Object> = {|
  schema?: ObjectSchema,
  getAccessController: (
    storeProps: P,
  ) => AccessController<PurserIdentity, PurserIdentityProvider<PurserIdentity>>,
  getName: (storeProps: P) => string,
  type: *,
|};
