/* @flow */

import type { RecordOf } from 'immutable';

export type UserProps = {
  orbitStore: string,
  walletAddress: string,
  username?: string,
  avatar?: string,
  displayName?: string,
  bio?: string,
  website?: string,
  location?: string,
};

export type UserRecord = RecordOf<UserProps>;
