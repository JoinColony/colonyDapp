/* This file is part of the new data refactoring. do not delete! */
// Eventually we want to auto-generate this file from graphql models

// @todo use proper types for user properties
type Stub = any;
type InboxItem = Stub;
type Colony = Stub;

export interface UserProfile {
  avatarHash?: string | null;
  balance?: string;
  bio?: string;
  displayName?: string;
  location?: string;
  username?: string;
  walletAddress: string;
  website?: string;
}

export interface User {
  id: string; // User address
  inbox?: [InboxItem];
  profile: UserProfile;
  subscribedColonies?: [Colony];
  subscribedTasks?: [string] /* or actual tasks? */;
}
