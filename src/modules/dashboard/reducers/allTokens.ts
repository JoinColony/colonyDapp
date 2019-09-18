import { ReducerType, ActionTypes } from '~redux/index';
import { TokenRecord, FetchableData, Token } from '~immutable/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { withFetchableDataMap } from '~utils/reducers';

import { AllTokensMap, AllTokensInitialState } from '../state/index';

const tokensReducer: ReducerType<AllTokensMap> = (state, action) => {
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

      const record = Token({
        address: tokenAddress,
        decimals,
        isVerified,
        name,
        symbol,
      });

      return state.get(tokenAddress)
        ? state.setIn([tokenAddress, 'record'], record)
        : state.set(tokenAddress, FetchableData<TokenRecord>({ record }));
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<AllTokensMap, TokenRecord>(
  ActionTypes.TOKEN_INFO_FETCH,
  AllTokensInitialState,
)(tokensReducer);
