/* @flow */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { Address, ENSName } from '~types';
import type { ColonyRecordType, DataRecordType } from '~immutable';

export type AllColoniesMap = ImmutableMapType<
  ENSName,
  DataRecordType<ColonyRecordType>,
>;

export type AllColonyAvatarsMap = ImmutableMapType<string, string>;

export type AllColonyNamesMap = ImmutableMapType<Address, ENSName>;

export type AllColoniesProps = {|
  avatars: AllColonyAvatarsMap,
  colonies: AllColoniesMap,
  colonyNames: AllColonyNamesMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AllColoniesRecord = RecordOf<AllColoniesProps>;
