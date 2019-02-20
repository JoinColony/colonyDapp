/* @flow */

import { Map as ImmutableMap } from 'immutable';
import { combineReducers } from 'redux-immutable';

import type { ReducerType } from '~redux';
import type { AllTokensMap, AllTokensIconsMap } from '~immutable';

import { TokenRecord } from '~immutable';
import { ACTIONS } from '~redux';

import {
  DASHBOARD_TOKENS,
  DASHBOARD_TOKEN_ICONS,
  DASHBOARD_TOKEN_ICON_DEFAULTS,
} from '../constants';

const tokensReducer: ReducerType<
  AllTokensMap,
  {|
    TOKEN_INFO_FETCH_SUCCESS: *,
  |},
> = (state = new ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_INFO_FETCH_SUCCESS: {
      const { name, symbol, tokenAddress } = action.payload;
      const record = TokenRecord({
        address: tokenAddress,
        name,
        symbol,
      });
      return state.set(tokenAddress, record);
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
