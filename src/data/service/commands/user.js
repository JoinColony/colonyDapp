/* @flow */

import type { Address, OrbitDBAddress } from '~types';
import type { Command, DDBContext } from '../../types';

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
  walletAddress: Address,
  username?: string,
|}>;
export type UserMetadataCommandContext = DDBContext<{|
  walletAddress: Address,
  userMetadataStoreAddress: string | OrbitDBAddress,
|}>;
export type UserCommand<I: *> = Command<UserCommandContext, I>;
export type UserMetadataCommand<I: *> = Command<UserMetadataCommandContext, I>;

export type CreateUserProfileCommandArgs = {|
  displayName?: string,
  bio?: string,
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar?: string,
  website?: string,
  location?: string,
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

export const createUserProfile: UserCommand<CreateUserProfileCommandArgs> = ({
  ddb,
  metadata: { walletAddress, username },
}) => ({
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

export const updateUserProfile: UserCommand<UpdateUserProfileCommandArgs> = ({
  ddb,
  metadata: { walletAddress, username },
}) => ({
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

export const setUserAvatar: UserCommand<SetUserAvatarCommandArgs> = ({
  ddb,
  metadata: { walletAddress, username },
}) => ({
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

export const removeUserAvatar: UserCommand<*> = ({
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

export const markNotificationsAsRead: UserMetadataCommand<MarkNotificationsAsReadCommandArgs> = ({
  ddb,
  metadata: { walletAddress, userMetadataStoreAddress },
}) => ({
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
