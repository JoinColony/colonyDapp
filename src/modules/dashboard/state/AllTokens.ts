import { Map as ImmutableMap, fromJS } from 'immutable';

import { Address } from '~types/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import {
  FetchableData,
  FetchableDataRecord,
  FetchableDataType,
  Token,
  TokenRecord,
  TokenType,
} from '~immutable/index';

export type AllTokensMap = ImmutableMap<
  Address,
  FetchableDataRecord<TokenRecord>
> & { toJS(): { [address: string]: FetchableDataType<TokenType> } };

export const AllTokensInitialState = ImmutableMap({
  [ZERO_ADDRESS]: FetchableData<TokenRecord>({
    record: Token(
      fromJS({
        address: ZERO_ADDRESS,
        isVerified: true,
        name: 'Ether',
        symbol: 'ETH',
      }),
    ),
  }),
}) as AllTokensMap;
