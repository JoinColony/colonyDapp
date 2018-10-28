/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { UserProps } from '~types/UserRecord';

const defaultValues: UserProps = {
  walletAddress: '',
  username: '',
  avatar: undefined,
  displayName: undefined,
  bio: undefined,
  website: undefined,
  location: undefined,
};

// TODO: Ideally, we should be able to validate the required properties
// (`walletAddress`, `username`) before creating a record, rather than using
// empty strings.
const User: RecordFactory<UserProps> = Record(defaultValues);

export default User;
