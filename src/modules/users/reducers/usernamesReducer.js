/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { ACTIONS } from '~redux';
import { DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';

import type { UsernamesMap } from '~immutable';
import type { ReducerType } from '~redux';

const setUsername = (state: UsernamesMap, address: string, username?: string) =>
  username ? state.set(address, DataRecord({ record: username })) : state;

const usernamesReducer: ReducerType<
  UsernamesMap,
  {|
    CURRENT_USER_CREATE: *,
    USER_ADDRESS_FETCH_SUCCESS: *,
    USER_FETCH_SUCCESS: *,
    USERNAME_CREATE_SUCCESS: *,
    USERNAME_FETCH_SUCCESS: *,
  |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.USER_ADDRESS_FETCH_SUCCESS:
    case ACTIONS.USERNAME_FETCH_SUCCESS: {
      const { address, username } = action.payload;
      return setUsername(state, address, username);
    }

    case ACTIONS.USERNAME_CREATE_SUCCESS: {
      const {
        from: address,
        params: { username },
      } = action.payload;
      return setUsername(state, address, username);
    }

    case ACTIONS.CURRENT_USER_CREATE: {
      const {
        payload: {
          walletAddress,
          profileData: { username },
        },
      } = action;
      return setUsername(state, walletAddress, username);
    }

    case ACTIONS.USER_FETCH_SUCCESS: {
      const {
        payload: { walletAddress, username },
      } = action;
      return setUsername(state, walletAddress, username);
    }

    default:
      return state;
  }
};

export default withDataRecordMap<UsernamesMap, string>(
  ACTIONS.USERNAME_FETCH,
  ImmutableMap(),
)(usernamesReducer);
