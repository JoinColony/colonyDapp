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
export type Command<C: *, I: *> = C => {|
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (args: I) => Promise<*>,
  validate?: (args: I) => Promise<I>,
|};

export type Query<C: *, I: *, R: *> = C => {|
  execute: (args: I) => Promise<R>,
|};

export type DDBContext<M: *> = {|
  ddb: DDB,
  metadata: M,
|};

export type ContractContext<M: *> = DDBContext<M> & {|
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
|};

export type ContractCommand<M: *, I: *> = Command<ContractContext<M>, I>;
export type DDBCommand<M: *, I: *> = Command<DDBContext<M>, I>;

export type ContractQuery<M: *, I: *, R: *> = Query<ContractContext<M>, I, R>;
export type DDBQuery<M: *, I: *, R: *> = Query<DDBContext<M>, I, R>;

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
