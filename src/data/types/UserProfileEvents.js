/* @flow */

import { USER_PROFILE_EVENT_TYPES } from '../constants';

import type { Address } from '~types';

import type { EventDefinition } from './events';

export type UserProfileEvents = {|
  USER_PROFILE_CREATED: EventDefinition<
    typeof USER_PROFILE_EVENT_TYPES.USER_PROFILE_CREATED,
    {|
      inboxStoreAddress: string,
      metadataStoreAddress: string,
      username: string,
      walletAddress: Address,
    |},
  >,
  USER_PROFILE_UPDATED: EventDefinition<
    typeof USER_PROFILE_EVENT_TYPES.USER_PROFILE_UPDATED,
    {|
      bio?: string,
      displayName?: string,
      location?: string,
      website?: string,
    |},
  >,
  USER_AVATAR_UPLOADED: EventDefinition<
    typeof USER_PROFILE_EVENT_TYPES.USER_AVATAR_UPLOADED,
    {|
      avatarHash: string,
    |},
  >,
  USER_AVATAR_REMOVED: EventDefinition<
    typeof USER_PROFILE_EVENT_TYPES.USER_AVATAR_REMOVED,
    void,
  >,
|};
