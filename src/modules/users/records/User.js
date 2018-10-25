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

const User: RecordFactory<UserProps> = Record(defaultValues);

export default User;
