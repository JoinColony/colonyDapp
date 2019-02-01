/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { DDB } from '../../lib/database';

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

export type QueryContext<M: *> = {|
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
  metadata: M,
|};

export type CommandContext<M: *> = {|
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
  metadata: M,
|};

export type DDBCommandContext<M: *> = {|
  ddb: DDB,
  metadata: M,
|};
