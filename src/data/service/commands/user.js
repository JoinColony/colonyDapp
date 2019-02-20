/* @flow */

import type { OrbitDBAddress } from '~types';
import type { Command, Context, IPFSContext, DDBContext } from '../../types';
import type {
  EventStore,
  FeedStore,
  ValidatedKVStore,
} from '../../../lib/database/stores';
import type { UserProfileStoreValues } from '../../storeValuesTypes';

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
  username: string,
|};

export type CreateUserProfileCommandReturn = {|
  inboxStore: FeedStore,
  metadataStore: EventStore,
  profileStore: ValidatedKVStore<UserProfileStoreValues>,
|};

export type UpdateUserProfileCommandArgs = {|
  bio?: string,
  displayName?: string,
  location?: string,
  website?: string,
|};

export type SetUserAvatarCommandArgs = {|
  data: string,
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
  ValidatedKVStore<UserProfileStoreValues>,
> = ({ ddb, metadata }) => ({
  schema: UpdateUserProfileCommandArgsSchema,
  async execute(args) {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set(args);
    await profileStore.load();
    return profileStore;
  },
});

export const setUserAvatar: Command<
  UserAvatarCommandContext,
  SetUserAvatarCommandArgs,
  string,
> = ({ ddb, ipfsNode, metadata }) => ({
  schema: SetUserAvatarCommandArgsSchema,
  async execute({ data }) {
    const avatar = await ipfsNode.addString(data);
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set({ avatar });
    return avatar;
  },
});

// TODO unpin the avatar when ipfsNode supports it
export const removeUserAvatar: UserCommand<
  void,
  ValidatedKVStore<UserProfileStoreValues>,
> = ({ ddb, metadata }) => ({
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
