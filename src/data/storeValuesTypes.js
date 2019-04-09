/* @flow */

// XXX this file should be deleted if we migrate away from
// ValidatedKVStores (and use event/feed stores).

export type UserProfileStoreValues = {|
  avatarHash?: ?string,
  bio?: string,
  createdAt: number,
  displayName?: string,
  inboxStoreAddress: string,
  location?: string,
  metadataStoreAddress: string,
  username: string,
  walletAddress: string,
  website?: string,
  tokens?: string[],
|};
