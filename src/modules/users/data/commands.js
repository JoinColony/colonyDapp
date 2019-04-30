/* @flow */

import type { Address, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  Command,
  DDB,
  UserInboxStore,
  UserMetadataStore,
  UserProfileStore,
} from '~data/types';

import { CONTEXT } from '~context';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import {
  createUserProfileStore,
  getUserProfileStore,
  getUserMetadataStore,
  getUserInboxStore,
} from '~data/stores';
import { createEvent } from '~data/utils';
import { USER_EVENT_TYPES } from '~data/constants';

import { getUserTokenAddresses } from './utils';

import {
  UserUpdateTokensCommandArgsSchema,
  CreateUserProfileCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
} from './schemas';

type UserProfileStoreMetadata = {|
  walletAddress: Address,
|};

type UserInboxStoreMetadata = {|
  inboxStoreAddress: string | OrbitDBAddress,
  walletAddress: Address,
|};

type UserMetadataStoreMetadata = {|
  metadataStoreAddress: string | OrbitDBAddress,
  walletAddress: Address,
|};

const prepareProfileCommand = async (
  { ddb }: {| ddb: DDB |},
  metadata: UserProfileStoreMetadata,
) => getUserProfileStore(ddb)(metadata);

const prepareMetadataCommand = async (
  { ddb }: {| ddb: DDB |},
  metadata: UserMetadataStoreMetadata,
) => getUserMetadataStore(ddb)(metadata);

const prepareInboxStoreCommand = async (
  { ddb }: { ddb: DDB },
  metadata: UserInboxStoreMetadata,
) => getUserInboxStore(ddb)(metadata);

export const createUserProfile: Command<
  {|
    profileStore: UserProfileStore,
    inboxStore: UserInboxStore,
    metadataStore: UserMetadataStore,
  |},
  UserProfileStoreMetadata,
  {|
    username: string,
    walletAddress: string,
  |},
  {|
    profileStore: UserProfileStore,
    inboxStore: UserInboxStore,
    metadataStore: UserMetadataStore,
  |},
> = {
  context: [CONTEXT.DDB_INSTANCE],
  schema: CreateUserProfileCommandArgsSchema,
  async prepare({ ddb }: {| ddb: DDB |}, metadata: UserProfileStoreMetadata) {
    return createUserProfileStore(ddb)(metadata);
  },
  async execute({ profileStore, inboxStore, metadataStore }, args) {
    await profileStore.set({
      createdAt: Date.now(),
      inboxStoreAddress: inboxStore.address.toString(),
      metadataStoreAddress: metadataStore.address.toString(),
      ...args,
    });
    await profileStore.load();
    return { profileStore, inboxStore, metadataStore };
  },
};

export const updateUserProfile: Command<
  UserProfileStore,
  UserProfileStoreMetadata,
  {|
    bio?: string,
    displayName?: string,
    location?: string,
    website?: string,
  |},
  UserProfileStore,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  schema: UpdateUserProfileCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, args) {
    await profileStore.set(args);
    await profileStore.load();
    return profileStore;
  },
};

export const setUserAvatar: Command<
  UserProfileStore,
  UserProfileStoreMetadata,
  {|
    ipfsHash: string,
  |},
  string,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  schema: SetUserAvatarCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, { ipfsHash: avatarHash }) {
    await profileStore.set({ avatarHash });
    return avatarHash;
  },
};

/**
 * @todo Unpin the avatar when the PinnerConnector supports it.
 */
export const removeUserAvatar: Command<
  UserProfileStore,
  UserProfileStoreMetadata,
  void,
  UserProfileStore,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareProfileCommand,
  async execute(profileStore) {
    await profileStore.set({ avatarHash: null });
    await profileStore.load();
    return profileStore;
  },
};

export const updateTokens: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    tokens: string[],
  |},
  UserMetadataStore,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  schema: UserUpdateTokensCommandArgsSchema,
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { tokens }) {
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
          userMetadataStore.append(
            createEvent(USER_EVENT_TYPES.TOKEN_ADDED, { address }),
          ),
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
          userMetadataStore.append(
            createEvent(USER_EVENT_TYPES.TOKEN_REMOVED, { address }),
          ),
        ),
    );

    return userMetadataStore;
  },
};

// This is currently unused
export const markNotificationsAsRead: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    readUntil: string,
    exceptFor?: string[],
  |},
  UserMetadataStore,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  schema: MarkNotificationsAsReadCommandArgsSchema,
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, args) {
    await userMetadataStore.append(
      createEvent(USER_EVENT_TYPES.READ_UNTIL, args),
    );
    return userMetadataStore;
  },
};

export const subscribeToTask: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    colonyAddress: Address,
    draftId: TaskDraftId,
    userDraftIds: [Address, TaskDraftId][],
  |},
  ?TaskDraftId,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, draftId, userDraftIds }) {
    const draftIds = userDraftIds
      .filter(([userColonyAddress]) => userColonyAddress === colonyAddress)
      .map(([, userDraftId]) => userDraftId);

    if (draftIds.includes(draftId)) {
      return null;
    }
    await userMetadataStore.append(
      createEvent(USER_EVENT_TYPES.SUBSCRIBED_TO_TASK, {
        colonyAddress,
        draftId,
      }),
    );
    return draftId;
  },
};

// This is currently unused
export const unsubscribeToTask: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    colonyAddress: Address,
    draftId: TaskDraftId,
    userDraftIds: TaskDraftId[],
  |},
  ?TaskDraftId,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, draftId, userDraftIds }) {
    const draftIds = userDraftIds
      .filter(([userColonyAddress]) => userColonyAddress === colonyAddress)
      .map(([, userDraftId]) => userDraftId);

    if (!draftIds.includes(draftId)) {
      return null;
    }

    await userMetadataStore.append(
      createEvent(USER_EVENT_TYPES.UNSUBSCRIBED_FROM_TASK, {
        colonyAddress,
        draftId,
      }),
    );
    return draftId;
  },
};

export const subscribeToColony: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    colonyAddress: Address,
    userColonyAddresses: Address[],
  |},
  ?Address,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, userColonyAddresses }) {
    if (
      userColonyAddresses &&
      userColonyAddresses.some(
        userColonyAddress => userColonyAddress === colonyAddress,
      )
    )
      return null;
    await userMetadataStore.append(
      createEvent(USER_EVENT_TYPES.SUBSCRIBED_TO_COLONY, { colonyAddress }),
    );
    return colonyAddress;
  },
};

export const unsubscribeToColony: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    colonyAddress: Address,
    userColonyAddresses: Address[],
  |},
  ?Address,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, userColonyAddresses }) {
    if (
      userColonyAddresses &&
      !userColonyAddresses.some(
        userColonyAddress => userColonyAddress === colonyAddress,
      )
    )
      return null;
    await userMetadataStore.append(
      createEvent(USER_EVENT_TYPES.UNSUBSCRIBED_FROM_COLONY, { colonyAddress }),
    );
    return colonyAddress;
  },
};

export const commentMentionNotification: Command<
  UserInboxStore,
  UserInboxStoreMetadata,
  {|
    colonyAddress: Address,
    comment?: string,
    event: string,
    taskTitle?: string,
  |},
  UserInboxStore,
> = {
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareInboxStoreCommand,
  async execute(userInboxStore, args) {
    await userInboxStore.append(
      createEvent(USER_EVENT_TYPES.COMMENT_MENTION, args),
    );
    return userInboxStore;
  },
};
