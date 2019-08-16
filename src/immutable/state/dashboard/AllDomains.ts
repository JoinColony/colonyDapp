import { Map as ImmutableMapType, Set as ImmutableSet } from 'immutable';

import { ENSName } from '~types/index';

import { DataRecordType } from '../../Data';
import { DomainRecordType } from '../../Domain';

type DomainsSet = ImmutableSet<DomainRecordType>;

export type AllDomainsMap = ImmutableMapType<
  ENSName,
  DataRecordType<DomainsSet>
>;
