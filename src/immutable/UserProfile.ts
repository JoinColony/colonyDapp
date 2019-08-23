import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

import { Address } from '~types/index';

interface Shared {
  avatarHash?: string | null;
  balance?: string;
  bio?: string;
  displayName?: string;
  location?: string;
  username?: string;
  walletAddress: Address;
  website?: string;
  inboxStoreAddress: string;
  metadataStoreAddress: string;
}

export type UserProfileType = $ReadOnly<Shared>;

export type UserProfileRecordType = RecordOf<Shared>;

const defaultProps: Shared = {
  avatarHash: undefined,
  balance: undefined,
  bio: undefined,
  displayName: undefined,
  location: undefined,
  username: undefined,
  walletAddress: undefined,
  website: undefined,
  inboxStoreAddress: undefined,
  metadataStoreAddress: undefined,
};

export const UserProfileRecord: Record.Factory<Shared> = Record(defaultProps);

export default UserProfileRecord;
