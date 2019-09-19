import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

import { ENSName } from '~types/index';

import { FetchableDataRecord, DomainRecord } from '~immutable/index';

type DomainsSet = ImmutableSet<DomainRecord>;

export type AllDomainsMap = ImmutableMap<
  ENSName,
  FetchableDataRecord<DomainsSet>
>;
