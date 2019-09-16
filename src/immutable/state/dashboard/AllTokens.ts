import { Map as ImmutableMap } from 'immutable';

import { Address } from '~types/index';
import { FetchableDataRecord, TokenRecord } from '~immutable/index';

export type AllTokensMap = ImmutableMap<
  Address,
  FetchableDataRecord<TokenRecord>
>;
