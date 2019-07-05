/* @flow */

import { Map as ImmutableMap } from 'immutable';

import type { ReducerType } from '~redux';
import type { AllTokensMap, TokenRecordType } from '~immutable';

import { DataRecord, TokenRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { withDataRecordMap } from '~utils/reducers';

const INITIAL_STATE = ImmutableMap([
  [
    ZERO_ADDRESS,
    DataRecord({
      record: TokenRecord({
        address: ZERO_ADDRESS,
        symbol: 'ETH',
        name: 'Ether',
      }),
    }),
  ],
]);

const tokensReducer: ReducerType<
  AllTokensMap,
  {|
    TOKEN_INFO_FETCH_SUCCESS: *,
  |},
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_INFO_FETCH_SUCCESS: {
      const { name, symbol, decimals, tokenAddress } = action.payload;
      /*
       If the token is ether there is no data about it in the db
       we initialise it only here in the reducer

       If we do not have this condition here the ether token info
       gets overwritten with empty values.
       */
      if (tokenAddress === ZERO_ADDRESS) {
        return state;
      }

      const record = TokenRecord({
        address: tokenAddress,
        decimals,
        name,
        symbol,
      });

      return state.get(tokenAddress)
        ? state.setIn([tokenAddress, 'record'], record)
        : state.set(tokenAddress, DataRecord<TokenRecordType>({ record }));
    }
    default:
      return state;
  }
};

export default withDataRecordMap<AllTokensMap, TokenRecordType>(
  ACTIONS.TOKEN_INFO_FETCH,
  ImmutableMap(),
)(tokensReducer);
