/* @flow */

import type { RecordFactory } from 'immutable';

import { Record, List } from 'immutable';

import type { ProfileProps, UserActivity, UserProps } from '~types';

const defaultProfileValues: ProfileProps = {
  walletAddress: '',
  username: undefined,
  avatar: undefined,
  displayName: undefined,
  bio: undefined,
  website: undefined,
  location: undefined,
  activitiesStore: '',
  profileStore: '',
};

const defaultActivities: List<UserActivity> = List();

const defaultValues: UserProps = {
  // FIXME profile needs to be a Record for this to be immutable
  profile: defaultProfileValues,
  activities: defaultActivities,
};

// TODO: Ideally, we should be able to validate the required properties
// (`walletAddress`, `profileStore`) before creating a record, rather than using
// empty strings.
const User: RecordFactory<UserProps> = Record(defaultValues);

export default User;
