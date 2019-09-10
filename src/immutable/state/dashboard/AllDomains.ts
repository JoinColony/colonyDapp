import { Map as ImmutableMapType, Set as ImmutableSet } from 'immutable';

import { ENSName } from '~types/index';

import { FetchableDataRecord } from '../../FetchableData';
import { DomainRecord } from '../../Domain';

type DomainsSet = ImmutableSet<DomainRecord>;

export type AllDomainsMap = ImmutableMapType<
  ENSName,
  FetchableDataRecord<DomainsSet>
>;
