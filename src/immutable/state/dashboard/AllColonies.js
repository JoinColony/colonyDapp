/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { Map as ImmutableMapType, RecordOf } from 'immutable';

import type { Address, ENSName } from '~types';
import type { ColonyRecord, DataRecord } from '~immutable';

export type AllColoniesMap = ImmutableMapType<
  ENSName,
  DataRecord<ColonyRecord>,
>;

export type AllColonyAvatarsMap = ImmutableMapType<string, string>;

export type AllColonyENSNamesMap = ImmutableMapType<Address, ENSName>;

export type AllColoniesProps = {|
  avatars: AllColonyAvatarsMap,
  colonies: AllColoniesMap,
  ensNames: AllColonyENSNamesMap,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type AllColoniesRecord = RecordOf<AllColoniesProps>;
