import { Map as ImmutableMap } from 'immutable';

import { Address, DomainsMap } from '~types/index';

import {
  FetchableDataType,
  FetchableDataRecord,
  DomainType,
} from '~immutable/index';

export type AllDomainsMap = ImmutableMap<
  Address,
  FetchableDataRecord<DomainsMap>
> & { toJS(): Record<Address, FetchableDataType<Record<string, DomainType>>> };
