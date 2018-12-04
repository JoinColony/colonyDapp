/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { ProfileProps, UserActivity, UserProps } from '~types/index';

const defaultProfileValues: ProfileProps = {
  walletAddress: '',
  databases: {},
  username: undefined,
  avatar: undefined,
  displayName: undefined,
  bio: undefined,
  website: undefined,
  location: undefined,
};

const defaultActivities: Array<UserActivity> = [];

const defaultValues: UserProps = {
  profile: defaultProfileValues,
  activities: defaultActivities,
  profileStore: '',
  activitiesStore: '',
  colonyStores: {},
  domainStores: {},
};

// TODO: Ideally, we should be able to validate the required properties
// (`walletAddress`, `profileStore`) before creating a record, rather than using
// empty strings.
const User: RecordFactory<UserProps> = Record(defaultValues);

export default User;
