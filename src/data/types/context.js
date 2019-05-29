/* @flow */

import type {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';

import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { DDB as DDBType } from '../../lib/database';
import type IPFSNodeType from '../../lib/ipfs';
import type ColonyManagerType from '../../lib/ColonyManager';
import type ENS from '~lib/ENS';

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
export type ENSCacheContext = {| ens: ENS |};

export type ColonyClient = ColonyClientType;
export type ColonyManager = ColonyManagerType;
export type DDB = DDBType;
export type ENSCache = ENS;
export type IPFSNode = IPFSNodeType;
export type NetworkClient = NetworkClientType;
export type Wallet = WalletObjectType;
