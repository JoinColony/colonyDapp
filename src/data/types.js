/* @flow */

import type {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Schema as SchemaType } from 'yup';

import type { DDB as DDBType } from '../lib/database';
import type IPFSNodeType from '../lib/ipfs';

import ENS from '../lib/ENS';

/*
 * The specification for a data command.
 *
 * C: Optional object type indicating the context the command will
 * be executed with.
 *
 * A: Optional object type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Command<C: ?Object, A: ?Object, R> = C => {|
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (args: A) => Promise<R>,
  schema?: SchemaType,
|};

/*
 * The specification for a data query.
 *
 * C: Optional object type indicating the context the query will
 * be executed with.
 *
 * A: Optional type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Query<C: ?Object, A, R> = C => {|
  execute: (args: A) => Promise<R>,
|};

/*
 * Type that produces a context object with a `metadata` property
 * and any other context properties
 *
 * M: Object type for the `metadata` property; this is usually data
 * that is used to get a store, e.g. store address or colony address.
 *
 * R: Optional object for the rest of the context (e.g. `DDBContext & IPFSContext`).
 */
export type ContextWithMetadata<M: *, R: *> = {| metadata: M, ...R |};

/*
 * Individual context object types; these are not metadata, but are rather
 * things that have some function needed for commands/queries.
 */
export type DDBContext = {| ddb: DDBType |};
export type IPFSContext = {| ipfsNode: IPFSNodeType |};
export type ColonyClientContext = {| colonyClient: ColonyClientType |};
export type NetworkClientContext = {| networkClient: NetworkClientType |};
export type WalletContext = {| wallet: WalletObjectType |};
export type ENSCacheContext = {| ensCache: ENS |};

/*
 * Object type representing the payload of an event; this includes
 * various metadata properties and the actual payload properties.
 *
 * P: Object type representing the payload properties (technically optional).
 */
export type EventPayload<P: ?Object> = {|
  id: string,
  timestamp: number,
  version: number,
  ...P,
|};

/*
 * Object type representing an event.
 *
 * T: String type for the event type, e.g. `DUE_DATE_SET`.
 * P: Object type representing the payload properties (technically optional).
 */
export type Event<T: string, P: ?Object> = {|
  type: T,
  payload: EventPayload<P>,
|};

/*
 * Function type representing an event creator.
 *
 * A: Object type for the function arguments (technically optional).
 * E: Event type that will be created.
 */
export type EventCreator<A: ?Object, E: Event<*, *>> = (args: A) => E;
