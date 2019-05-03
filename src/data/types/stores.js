/* @flow */

import type { ObjectSchema } from 'yup';
import type { OrbitDBAddress } from '~types';
import type { AccessController } from './accessControllers';

import { EventStore } from '~lib/database/stores';
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

export type StoreClassWrapper = typeof EventStore;
export type StoreAddressResolverFn<P> = {|
  id: string,
  handler: (...deps: *) => (props: P) => Promise<string | OrbitDBAddress>,
|};

export type StoreBlueprint<P: Object, AC: AccessController<*, *>> = {|
  deterministicAddress?: boolean,
  getAccessController: (storeProps: P) => AC,
  getName: (storeProps: P) => string,
  resolver: StoreAddressResolverFn<P>,
  schema?: ObjectSchema,
  type: StoreClassWrapper,
|};
