/* @flow */

import type { Address, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';
import type { EventStore, ValidatedKVStore } from '~lib/database/stores';
import type { Command, ContextWithMetadata, DDBContext } from '~data/types';
import type { UserProfileStoreValues } from '~data/storeValuesTypes';

import {
  createUserProfileStore,
  getUserProfileStore,
  getUserMetadataStore,
  getUserInboxStore,
} from '~data/stores';

import {
  createUserAddTokenEvent,
  createUserRemoveTokenEvent,
  createNotificationsReadEvent,
  createSubscribeToColonyEvent,
  createUnsubscribeToColonyEvent,
  createSubscribeToTaskEvent,
  createUnsubscribeToTaskEvent,
  createCommentMentionInboxEvent,
} from './events';

import { getUserColonies, getUserTasks } from './queries';

import { getUserTokenAddresses } from './utils';

import {
  UserUpdateTokensCommandArgsSchema,
  CreateUserProfileCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
} from './schemas';

import { ZERO_ADDRESS } from '~utils/web3/constants';

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
  DDBContext,
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

export type UserActivityCommandContext = ContextWithMetadata<
  {|
    walletAddress: string,
    inboxStoreAddress: string | OrbitDBAddress,
  |},
  DDBContext,
>;

export type UserInboxCommand<I: *, R: *> = Command<
  UserActivityCommandContext,
  I,
  R,
>;

export type CommentMentionInboxCommandArgs = {|
  event: string,
  user?: string,
  task?: string,
  comment?: string,
  colonyName?: string,
|};

export const createUserProfile: UserCommand<
  {|
    username: string,
  |},
  {|
    inboxStore: EventStore,
    metadataStore: EventStore,
    profileStore: ValidatedKVStore<UserProfileStoreValues>,
  |},
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
  {|
    bio?: string,
    displayName?: string,
    location?: string,
    website?: string,
  |},
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
  {|
    ipfsHash: string,
  |},
  string,
> = ({ ddb, metadata }) => ({
  schema: SetUserAvatarCommandArgsSchema,
  async execute({ ipfsHash }) {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set({ avatarHash: ipfsHash });
    return ipfsHash;
  },
});

// TODO unpin the avatar when ipfsNode supports it
export const removeUserAvatar: UserCommand<
  void,
  ValidatedKVStore<UserProfileStoreValues>,
> = ({ ddb, metadata }) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    await profileStore.set({ avatarHash: null });
    await profileStore.load();
    return profileStore;
  },
});

export const updateTokens: UserMetadataCommand<
  {|
    tokens: string[],
  |},
  EventStore,
> = ({ ddb, metadata }) => ({
  schema: UserUpdateTokensCommandArgsSchema,
  async execute(args) {
    const { tokens } = args;
    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);

    // get existing tokens, plus ether so we don't add that
    const currentTokens = [
      ZERO_ADDRESS,
      ...getUserTokenAddresses(userMetadataStore),
    ];

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
  {|
    readUntil: string,
    exceptFor?: string[],
  |},
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
  {|
    draftId: TaskDraftId,
  |},
  ?string,
> = context => ({
  async execute(args) {
    const { ddb, metadata } = context;
    const draftIds = await getUserTasks(context).execute();

    if (draftIds.some(draftId => draftId === args.draftId)) return null;

    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createSubscribeToTaskEvent(args));
    return args.draftId;
  },
});

export const unsubscribeToTask: UserMetadataCommand<
  {|
    draftId: TaskDraftId,
  |},
  ?string,
> = context => ({
  async execute(args) {
    const { ddb, metadata } = context;
    const draftIds = await getUserTasks(context).execute();

    if (!draftIds.some(draftId => draftId === args.draftId)) return null;

    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createUnsubscribeToTaskEvent(args));
    return args.draftId;
  },
});

export const subscribeToColony: UserMetadataCommand<
  {|
    colonyAddress: Address,
  |},
  ?string,
> = context => ({
  async execute(args) {
    const { ddb, metadata } = context;
    const colonies = await getUserColonies(context).execute();

    if (colonies.some(colonyAddress => colonyAddress === args.colonyAddress))
      return null;

    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createSubscribeToColonyEvent(args));
    return args.colonyAddress;
  },
});

export const unsubscribeToColony: UserMetadataCommand<
  {|
    colonyAddress: Address,
  |},
  ?string,
> = context => ({
  async execute(args) {
    const { ddb, metadata } = context;
    const colonies = await getUserColonies(context).execute();

    if (!colonies.some(colonyAddress => colonyAddress === args.colonyAddress))
      return null;

    const userMetadataStore = await getUserMetadataStore(ddb)(metadata);
    await userMetadataStore.append(createUnsubscribeToColonyEvent(args));
    return args.colonyAddress;
  },
});

export const commentMentionNotification: UserInboxCommand<
  CommentMentionInboxCommandArgs,
  EventStore,
> = ({ ddb, metadata }) => ({
  async execute(args) {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    await userInboxStore.append(createCommentMentionInboxEvent(args));
    return userInboxStore;
  },
});
