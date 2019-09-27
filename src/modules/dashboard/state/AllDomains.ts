import { Map as ImmutableMap } from 'immutable';

import { Address } from '~types/index';

import { FetchableDataRecord, DomainRecord } from '~immutable/index';

export type DomainsMap = ImmutableMap<DomainRecord['id'], DomainRecord>;

export type AllDomainsMap = ImmutableMap<
  Address,
  FetchableDataRecord<DomainsMap>
>;
