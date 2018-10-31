/* @flow */

import type { RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UserProfileProps } from '~types/UserProfileStateRecord';

const defaultState: UserProfileProps = {
  isLoading: false,
  isError: false,
  userProfiles: new ImmutableMap(),
};

const UserProfilesState: RecordFactory<UserProfileProps> = Record(defaultState);

export default UserProfilesState;
