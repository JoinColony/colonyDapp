/* @flow */

import type { RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import { SET_USER_PROFILE, UPDATE_USER_PROFILE } from '../actionTypes';

import type { Action } from '~types/';
import type { UserRecord, UserProps } from '~types/UserRecord';

const defaultValues: UserProps = {
  walletAddress: '',
  username: '',
  avatar: undefined,
  displayName: undefined,
  bio: undefined,
  website: undefined,
  location: undefined,
};

const User: RecordFactory<UserProps> = Record(defaultValues);

type WalletAddress = string;
type State = ImmutableMap<WalletAddress, UserRecord>;

const INITIAL_STATE = new ImmutableMap();

const userProfilesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_USER_PROFILE: {
      const { walletAddress, set } = action.payload;
      return state.set(walletAddress, User(set));
    }
    case UPDATE_USER_PROFILE: {
      const { walletAddress, update } = action.payload;
      return state.mergeIn(walletAddress, update);
    }
    default:
      return state;
  }
};

export default userProfilesReducer;
