import { Record } from 'immutable';

import { Address, DefaultValues } from '~types/index';

interface Shared {
  avatarHash?: string | null;
  balance?: string;
  bio?: string;
  displayName?: string;
  location?: string;
  username?: string;
  walletAddress: Address;
  website?: string;
  inboxStoreAddress?: string;
  metadataStoreAddress?: string;
}

export type UserProfileType = Readonly<Shared>;

const defaultValues: DefaultValues<Shared> = {
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

export class UserProfileRecord extends Record<Shared>(defaultValues) {}

export const UserProfile = (p: Shared) => new UserProfileRecord(p);
