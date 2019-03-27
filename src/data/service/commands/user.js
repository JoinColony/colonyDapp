/* @flow */

import type { OrbitDBAddress } from '~types';
import type {
  Command,
  ContextWithMetadata,
  IPFSContext,
  DDBContext,
} from '../../types';
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

import {
  createUserAddTokenEvent,
  createUserRemoveTokenEvent,
  createNotificationsReadEvent,
  createSubscribeToColonyEvent,
  createUnsubscribeToColonyEvent,
  createSubscribeToTaskEvent,
  createUnsubscribeToTaskEvent,
} from '../events';

import {
  UserUpdateTokensCommandArgsSchema,
  CreateUserProfileCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
} from './schemas';

import { getUserTokensReducer } from '../reducers';
import { USER_EVENT_TYPES } from '../../constants';

const { TOKEN_ADDED, TOKEN_REMOVED } = USER_EVENT_TYPES;

type UserCommandMetadata = {|
  walletAddress: string,
  username?: string,
|};

export type UserCommandContext = ContextWithMetadata<
  UserCommandMetadata,
  DDBContext,
>;

export type UserAvatarCommandContext = ContextWithMetadata<
  UserCommandMetadata,
  DDBContext & IPFSContext,
>;

export type UserMetadataCommandContext = ContextWithMetadata<
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

export type SubscribeToTaskCommandArgs = {|
  draftId: string,
|};

export type UnsubscribeToTaskCommandArgs = {|
  draftId: string,
|};

export type SubscribeToColonyCommandArgs = {|
  address: string,
|};

export type UnsubscribeToColonyCommandArgs = {|
  address: string,
|};

export type UpdateTokensCommandArgs = {|
  tokens: string[],
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

export const updateTokens: UserMetadataCommand<
  UpdateTokensCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  schema: UserUpdateTokensCommandArgsSchema,
  async execute(args) {
    const { tokens } = args;
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);

    // get existing tokens
    const currentTokens = await Promise.all(
      userMetadataStore
        .all()
        .filter(({ type }) => type === TOKEN_ADDED || type === TOKEN_REMOVED)
        .reduce(getUserTokensReducer, []),
    );

    // add new missing tokens to store
    await Promise.all(
      tokens
        .filter(
          token =>
            !currentTokens.find(
              currentToken =>
                token.toLowerCase() === currentToken.toLowerCase(),
            ),
        )
        .map(address =>
          userMetadataStore.append(createUserAddTokenEvent({ address })),
        ),
    );

    // remove tokens from store which have been removed by user
    await Promise.all(
      currentTokens
        .filter(
          currentToken =>
            !tokens.find(
              token => token.toLowerCase() === currentToken.toLowerCase(),
            ),
        )
        .map(address =>
          userMetadataStore.append(createUserRemoveTokenEvent({ address })),
        ),
    );

    return userMetadataStore;
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

export const subscribeToTask: UserMetadataCommand<
  SubscribeToTaskCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  async execute(args) {
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createSubscribeToTaskEvent(args));
    return userMetadataStore;
  },
});

export const unsubscribeToTask: UserMetadataCommand<
  UnsubscribeToTaskCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  async execute(args) {
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createUnsubscribeToTaskEvent(args));
    return userMetadataStore;
  },
});

export const subscribeToColony: UserMetadataCommand<
  SubscribeToColonyCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  async execute(args) {
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createSubscribeToColonyEvent(args));
    return userMetadataStore;
  },
});

export const unsubscribeToColony: UserMetadataCommand<
  UnsubscribeToColonyCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  async execute(args) {
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createUnsubscribeToColonyEvent(args));
    return userMetadataStore;
  },
});
