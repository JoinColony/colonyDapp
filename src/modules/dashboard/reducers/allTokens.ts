import { Map as ImmutableMap, fromJS } from 'immutable';

import { ReducerType, ActionTypes } from '~redux/index';
import {
  AllTokensMap,
  TokenRecordType,
  DataRecord,
  TokenRecord,
} from '~immutable/index';

import { ZERO_ADDRESS } from '~utils/web3/constants';
import { withDataRecordMap } from '~utils/reducers';

const INITIAL_STATE: AllTokensMap = ImmutableMap({
  [ZERO_ADDRESS]: DataRecord<TokenRecordType>({
    record: TokenRecord(
      fromJS({
        address: ZERO_ADDRESS,
        isVerified: true,
        name: 'Ether',
        symbol: 'ETH',
      }),
    ),
  }),
});

const tokensReducer: ReducerType<AllTokensMap> = (
  state = INITIAL_STATE,
  action,
) => {
  switch (action.type) {
    case ActionTypes.TOKEN_INFO_FETCH_SUCCESS: {
      const {
        isVerified,
        name,
        symbol,
        decimals,
        tokenAddress,
      } = action.payload;

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
        isVerified,
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
  ActionTypes.TOKEN_INFO_FETCH,
  INITIAL_STATE,
)(tokensReducer);
