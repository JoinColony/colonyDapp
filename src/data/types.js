/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { DDB } from '../lib/database';

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
  validate?: (args: I) => Promise<I>,
|};

export type Query<C: *, I: *, R: *> = C => {|
  execute: (args: I) => Promise<R>,
|};

export type DDBContext<M: *> = {|
  ddb: DDB,
  metadata: M,
|};

export type ContractContext<M: *> = {|
  ddb: DDB,
  metadata: M,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
|};

export type EventPayload = {|
  id: string,
  timestamp: number,
  version: number,
|};

export type Event<T: string, P: EventPayload> = {|
  type: T,
  payload: P,
|};

export type EventCreator<I: Object, O: Event<*, *>> = (args: I) => O;
