/* @flow */

import type {
  Map as ImmutableMapType,
  Set as ImmutableSetType,
} from 'immutable';

import type { ENSName } from '~types';

import type { DataRecordType } from '../../Data';
import type { DomainRecordType } from '../../Domain';

type DomainsSet = ImmutableSetType<DomainRecordType>;

export type AllDomainsMap = ImmutableMapType<
  ENSName,
  DataRecordType<DomainsSet>,
>;
