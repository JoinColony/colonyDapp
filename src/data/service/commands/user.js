/* @flow */

import type { OrbitDBAddress } from '~types';
import type { Command, Context, IPFSContext, DDBContext } from '../../types';
import type {
  EventStore,
  FeedStore,
  ValidatedKVStore,
} from '../../../lib/database/stores';

import {
  createUserProfileStore,
  getUserProfileStore,
  getUserMetadataStore,
} from '../../stores';

import { createNotificationsReadEvent } from '../events';

import {
  CreateUserProfileCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
} from './schemas';

type UserCommandMetadata = {|
  walletAddress: string,
  username?: string,
|};

export type UserCommandContext = Context<UserCommandMetadata, DDBContext>;

export type UserAvatarCommandContext = Context<
  UserCommandMetadata,
  DDBContext & IPFSContext,
>;

export type UserMetadataCommandContext = Context<
  {|
    walletAddress: string,
    userMetadataStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type UserCommand<I: *, R: *> = Command<UserCommandContext, I, R>;
export type UserMetadataCommand<I: *, R: *> = Command<
  UserMetadataCommandContext,
  I,
  R,
>;

export type CreateUserProfileCommandArgs = {|
  displayName?: string,
  bio?: string,
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar?: string,
  website?: string,
  location?: string,
|};

export type CreateUserProfileCommandReturn = {|
  inboxStore: FeedStore,
  metadataStore: EventStore,
  profileStore: ValidatedKVStore,
|};

export type UpdateUserProfileCommandArgs = {|
  displayName?: string,
  bio?: string,
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar?: string,
  website?: string,
  location?: string,
|};

export type SetUserAvatarCommandArgs = {|
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar: string,
|};

export type MarkNotificationsAsReadCommandArgs = {|
  readUntil: string,
  exceptFor?: string[],
|};

export const createUserProfile: UserCommand<
  CreateUserProfileCommandArgs,
  CreateUserProfileCommandReturn,
> = ({ ddb, metadata }) => ({
  schema: CreateUserProfileCommandArgsSchema,
  async execute(args) {
    const {
      profileStore,
      inboxStore,
      metadataStore,
    } = await createUserProfileStore(ddb)(metadata);

    const { walletAddress, username } = metadata;
    await profileStore.set({
      createdAt: Date.now(),
      walletAddress,
      username,
      inboxStoreAddress: inboxStore.address.toString(),
      metadataStoreAddress: metadataStore.address.toString(),
      ...args,
    });
    await profileStore.load();

    return { profileStore, inboxStore, metadataStore };
  },
});

export const updateUserProfile: UserCommand<
  UpdateUserProfileCommandArgs,
  ValidatedKVStore,
> = ({ ddb, metadata }) => ({
  schema: UpdateUserProfileCommandArgsSchema,
  async execute(args) {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set(args);
    await profileStore.load();
    return profileStore;
  },
});

export const setUserAvatar: UserCommand<
  SetUserAvatarCommandArgs,
  ValidatedKVStore,
> = ({ ddb, metadata }) => ({
  schema: SetUserAvatarCommandArgsSchema,
  async execute(args) {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set(args);
    await profileStore.load();
    return profileStore;
  },
});

export const removeUserAvatar: UserCommand<void, ValidatedKVStore> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set({ avatar: null });
    await profileStore.load();
    return profileStore;
  },
});

export const markNotificationsAsRead: UserMetadataCommand<
  MarkNotificationsAsReadCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  schema: MarkNotificationsAsReadCommandArgsSchema,
  async execute(args) {
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createNotificationsReadEvent(args));
    return userMetadataStore;
  },
});
