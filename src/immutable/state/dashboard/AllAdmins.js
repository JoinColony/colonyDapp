/* @flow */

import type {
  Map as ImmutableMapType,
  Set as ImmutableSetType,
} from 'immutable';

import type { ENSName } from '~types';

import type { DataRecordType } from '../../Data';

// We're just storing user addresses in here
type AdminsSet = ImmutableSetType<string>;

export type AllAdminsMap = ImmutableMapType<ENSName, DataRecordType<AdminsSet>>;
