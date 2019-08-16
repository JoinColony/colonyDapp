import {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';

import { WalletObjectType } from '@colony/purser-core';
import { DDB as DDBType } from '../../lib/database/index';
import IPFSNodeType from '../../lib/ipfs/index';
import ColonyManagerType from '../../lib/ColonyManager/index';
import ENS from '~lib/ENS/index';

/*
 * Type that produces a context object with a `metadata` property
 * and any other context properties
 *
 * M: Object type for the `metadata` property; this is usually data
 * that is used to get a store, e.g. store address or colony address.
 *
 * R: Optional object for the rest of the context (e.g. `DDBContext & IPFSContext`).
 */
export type ContextWithMetadata<M extends any, R extends any> = R & {
  metadata: M;
};

/*
 * Individual context object types; these are not metadata, but are rather
 * things that have some function needed for commands/queries.
 */
export type DDBContext = { ddb: DDBType };
export type IPFSContext = { ipfsNode: IPFSNodeType };
export type ColonyClientContext = { colonyClient: ColonyClientType };
export type NetworkClientContext = { networkClient: NetworkClientType };
export type WalletContext = { wallet: WalletObjectType };
export type ENSCacheContext = { ens: ENS };

export type ColonyClient = ColonyClientType;
export type ColonyManager = ColonyManagerType;
export type DDB = DDBType;
export type ENSCache = ENS;
export type IPFSNode = IPFSNodeType;
export type NetworkClient = NetworkClientType;
export type Wallet = WalletObjectType;
