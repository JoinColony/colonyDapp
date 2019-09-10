import { Address } from '~types/index';
import { EventDefinition } from './events';
import { EventTypes, Versions } from '../constants';

export type UserProfileEvents =
  | EventDefinition<
      EventTypes.USER_PROFILE_CREATED,
      {
        inboxStoreAddress: string;
        metadataStoreAddress: string;
        username: string;
        walletAddress: Address;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.USER_PROFILE_UPDATED,
      {
        bio?: string;
        displayName?: string;
        location?: string;
        website?: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.USER_AVATAR_UPLOADED,
      {
        avatarHash: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      // forcing a line break for visual consistency
      EventTypes.USER_AVATAR_REMOVED,
      null,
      Versions.CURRENT
    >;
