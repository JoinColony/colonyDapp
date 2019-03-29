/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import type { ENSName } from '~types';

import type { DataRecordType } from '../../Data';

import type { RolesRecordType } from '../../Roles';

export type AllRolesMap = ImmutableMapType<
  ENSName,
  DataRecordType<RolesRecordType>,
>;
