/* @flow */

import { Map as ImmutableMap } from 'immutable';
import { combineReducers } from 'redux-immutable';

import type { ReducerType } from '~redux';
import type { AllTokensMap, AllTokensIconsMap } from '~immutable';

import { TokenRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { ZERO_ADDRESS } from '~utils/web3/constants';

import {
  DASHBOARD_TOKENS,
  DASHBOARD_TOKEN_ICONS,
  DASHBOARD_TOKEN_ICON_DEFAULTS,
} from '../constants';

const INITIAL_STATE = ImmutableMap([
  [
    ZERO_ADDRESS,
    TokenRecord({ address: ZERO_ADDRESS, symbol: 'ETH', name: 'Ether' }),
  ],
]);

const tokensReducer: ReducerType<
  AllTokensMap,
  {|
    TOKEN_INFO_FETCH_SUCCESS: *,
    COLONY_FETCH_SUCCESS: *,
  |},
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_INFO_FETCH_SUCCESS: {
      const { name, symbol, tokenAddress } = action.payload;
      const newInfo = {
        address: tokenAddress,
        name,
        symbol,
      };
      const existingRecord = state.get(tokenAddress);
      const record = existingRecord
        ? existingRecord.merge(newInfo)
        : TokenRecord(newInfo);
      return state.set(tokenAddress, record);
    }
    case ACTIONS.COLONY_FETCH_SUCCESS: {
      const { tokens } = action.payload;
      return tokens.reduce((currentState, token) => {
        const existingRecord = state.get(token.address);
        const record = existingRecord
          ? existingRecord.merge(token)
          : TokenRecord(token);
        return state.set(token.address, record);
      }, state);
    }
    default:
      return state;
  }
};

const tokenIconsReducer: ReducerType<AllTokensIconsMap, {}> = (
  state = ImmutableMap(DASHBOARD_TOKEN_ICON_DEFAULTS),
) => state;

export default combineReducers({
  [DASHBOARD_TOKENS]: tokensReducer,
  [DASHBOARD_TOKEN_ICONS]: tokenIconsReducer,
});
