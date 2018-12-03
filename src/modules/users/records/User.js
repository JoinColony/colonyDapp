/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { UserProps } from '~types';

const defaultValues: UserProps = {
  walletAddress: '',
  orbitStore: '',
  username: undefined,
  avatar: undefined,
  displayName: undefined,
  bio: undefined,
  website: undefined,
  location: undefined,
};

// TODO: Ideally, we should be able to validate the required properties
// (`walletAddress`, `orbitStore`) before creating a record, rather than using
// empty strings.
const User: RecordFactory<UserProps> = Record(defaultValues);

export default User;
