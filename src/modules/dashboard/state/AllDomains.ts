import { Map as ImmutableMap } from 'immutable';

import { Address } from '~types/index';

import {
  FetchableDataType,
  FetchableDataRecord,
  DomainRecord,
  DomainType,
} from '~immutable/index';

export type DomainsMap = ImmutableMap<DomainRecord['id'], DomainRecord> & {
  toJS(): Record<string, DomainType>;
};

export type AllDomainsMap = ImmutableMap<
  Address,
  FetchableDataRecord<DomainsMap>
> & { toJS(): Record<Address, FetchableDataType<Record<string, DomainType>>> };
