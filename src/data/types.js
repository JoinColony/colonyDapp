/* @flow */

import type {
  ColonyClient as ColonyClientType,
  ColonyNetworkClient as NetworkClientType,
} from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Schema as SchemaType } from 'yup';
import type { DDB as DDBType } from '../lib/database';
import type IPFSNodeType from '../lib/ipfs';

/*
 * The specification for a store command.
 *
 * `I`: Object type indicating the arguments the command methods
 * will be called with.
 */
export type Command<C: *, I: *, R: *> = C => {|
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (args: I) => Promise<R>,
  schema?: SchemaType,
|};

export type Query<C: *, I: *, R: *> = C => {|
  execute: (args: I) => Promise<R>,
|};

/*
 * M: metadata object
 * R: rest object (e.g. `DDBContext & IPFSContext`)
 */
export type Context<M: *, R: *> = {| metadata: M, ...R |};

export type DDBContext = {| ddb: DDBType |};

export type IPFSContext = {| ipfsNode: IPFSNodeType |};

export type ColonyClientContext = {| colonyClient: ColonyClientType |};

export type NetworkClientContext = {| networkClient: NetworkClientType |};

export type WalletContext = {| wallet: WalletObjectType |};

export type EventPayload<I: *> = {|
  id: string,
  timestamp: number,
  version: number,
  ...I,
|};

export type Event<T: string, I: *> = {|
  type: T,
  payload: EventPayload<I>,
|};

export type EventCreator<I: Object, O: Event<*, *>> = (args: I) => O;
