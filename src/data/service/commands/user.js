/* @flow */

import type { OrbitDBAddress } from '~types';
import type { Command, DDBContext } from '../../types';
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

import { validate } from '../../utils';
import { createNotificationsReadEvent } from '../events';

import {
  CreateUserProfileCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
} from './schemas';

export type UserCommandContext = DDBContext<{|
  walletAddress: string,
  username?: string,
|}>;
export type UserMetadataCommandContext = DDBContext<{|
  walletAddress: string,
  userMetadataStoreAddress: string | OrbitDBAddress,
|}>;
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
> = ({ ddb, metadata: { walletAddress, username } }) => ({
  async validate(args) {
    return validate(CreateUserProfileCommandArgsSchema)(args);
  },
  async execute(args) {
    const { displayName, bio, avatar, website, location } = args;
    const {
      profileStore,
      inboxStore,
      metadataStore,
    } = await createUserProfileStore(ddb)({
      walletAddress,
      username,
    });

    await profileStore.set({
      createdAt: Date.now(),
      walletAddress,
      username,
      inboxStoreAddress: inboxStore.address.toString(),
      metadataStoreAddress: metadataStore.address.toString(),
      displayName,
      bio,
      avatar,
      website,
      location,
    });
    await profileStore.load();

    return { profileStore, inboxStore, metadataStore };
  },
});

export const updateUserProfile: UserCommand<
  UpdateUserProfileCommandArgs,
  ValidatedKVStore,
> = ({ ddb, metadata: { walletAddress, username } }) => ({
  async validate(args) {
    return validate(UpdateUserProfileCommandArgsSchema)(args);
  },
  async execute(args) {
    const { displayName, bio, avatar, website, location } = args;
    const profileStore = await getUserProfileStore(ddb)({
      walletAddress,
      username,
    });

    await profileStore.set({
      displayName,
      bio,
      avatar,
      website,
      location,
    });
    await profileStore.load();

    return profileStore;
  },
});

export const setUserAvatar: UserCommand<
  SetUserAvatarCommandArgs,
  ValidatedKVStore,
> = ({ ddb, metadata: { walletAddress, username } }) => ({
  async validate(args) {
    return validate(SetUserAvatarCommandArgsSchema)(args);
  },
  async execute(args) {
    const { avatar } = args;
    const profileStore = await getUserProfileStore(ddb)({
      walletAddress,
      username,
    });

    await profileStore.set({ avatar });
    await profileStore.load();

    return profileStore;
  },
});

export const removeUserAvatar: UserCommand<*, ValidatedKVStore> = ({
  ddb,
  metadata: { walletAddress, username },
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)({
      walletAddress,
      username,
    });

    await profileStore.set({ avatar: null });
    await profileStore.load();

    return profileStore;
  },
});

export const markNotificationsAsRead: UserMetadataCommand<
  MarkNotificationsAsReadCommandArgs,
  EventStore,
> = ({ ddb, metadata: { walletAddress, userMetadataStoreAddress } }) => ({
  async validate(args) {
    return validate(MarkNotificationsAsReadCommandArgsSchema)(args);
  },
  async execute(args) {
    const { readUntil, exceptFor } = args;
    const userMetadataStore = await getUserMetadataStore(ddb)({
      walletAddress,
      userMetadataStoreAddress,
    });

    await userMetadataStore.append(
      createNotificationsReadEvent({
        readUntil,
        exceptFor,
      }),
    );

    return userMetadataStore;
  },
});
