import { Map as ImmutableMap } from 'immutable';

import { Address } from '~types/index';
import { DataRecordType, TokenRecordType } from '~immutable/index';

export type AllTokensMap = ImmutableMap<
  Address,
  DataRecordType<TokenRecordType>
>;
