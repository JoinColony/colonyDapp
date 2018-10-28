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

const BaseUser: RecordFactory<UserProps> = Record(defaultValues);

export default class User extends BaseUser {
  // XXX unfortunately we cannot use e.g. `implements RecordOf<UserProps>` to
  // inherit the properties of this class, because this interferes with the
  // expected types from immutable (we have to set them again).

  walletAddress: string;

  username: string;

  avatar: string;

  displayName: string;

  bio: string;

  website: string;

  location: string;

  constructor(props: UserProps) {
    super(props);
    if (!props.walletAddress) throw new Error('Missing walletAddress');
    if (!props.username) throw new Error('Missing username');
  }
}
