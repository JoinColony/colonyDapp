import { Address } from '~types/index';
import { EventDefinition } from './events';
import { EventTypes } from '../constants';

export type UserProfileEvents =
  | EventDefinition<
      EventTypes.USER_PROFILE_CREATED,
      {
        inboxStoreAddress: string;
        metadataStoreAddress: string;
        username: string;
        walletAddress: Address;
      }
    >
  | EventDefinition<
      EventTypes.USER_PROFILE_UPDATED,
      {
        bio?: string;
        displayName?: string;
        location?: string;
        website?: string;
      }
    >
  | EventDefinition<
      EventTypes.USER_AVATAR_UPLOADED,
      {
        avatarHash: string;
      }
    >
  | EventDefinition<EventTypes.USER_AVATAR_REMOVED, null>;
