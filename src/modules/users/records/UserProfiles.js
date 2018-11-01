/* @flow */

import type { RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UserProfilesProps } from '~types/UserProfilesRecord';

const defaultState: UserProfilesProps = {
  isLoading: false,
  isError: false,
  userProfiles: new ImmutableMap(),
};

const UserProfiles: RecordFactory<UserProfilesProps> = Record(defaultState);

export default UserProfiles;
