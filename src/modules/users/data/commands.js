/* @flow */

import type { Address, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  Command,
  DDB,
  ENSCache,
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
import { USER_EVENT_TYPES, USER_PROFILE_EVENT_TYPES } from '~data/constants';

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

export const createUserProfile: Command<
  {|
    profileStore: UserProfileStore,
    inboxStore: UserInboxStore,
    metadataStore: UserMetadataStore,
  |},
  UserProfileStoreMetadata,
  {|
    username: string,
    walletAddress: Address,
  |},
  {|
    profileStore: UserProfileStore,
    inboxStore: UserInboxStore,
    metadataStore: UserMetadataStore,
  |},
> = {
  name: 'createUserProfile',
  context: [CONTEXT.DDB_INSTANCE],
  schema: CreateUserProfileCommandArgsSchema,
  async prepare({ ddb }: {| ddb: DDB |}, metadata: UserProfileStoreMetadata) {
    return createUserProfileStore(ddb)(metadata);
  },
  async execute({ profileStore, inboxStore, metadataStore }, args) {
    await profileStore.append(
      createEvent(USER_PROFILE_EVENT_TYPES.USER_PROFILE_CREATED, {
        inboxStoreAddress: inboxStore.address.toString(),
        metadataStoreAddress: metadataStore.address.toString(),
        ...args,
      }),
    );
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
  name: 'updateUserProfile',
  context: [CONTEXT.DDB_INSTANCE],
  schema: UpdateUserProfileCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, args) {
    await profileStore.append(
      createEvent(USER_PROFILE_EVENT_TYPES.USER_PROFILE_UPDATED, args),
    );
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
  name: 'setUserAvatar',
  context: [CONTEXT.DDB_INSTANCE],
  schema: SetUserAvatarCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, { ipfsHash: avatarHash }) {
    await profileStore.append(
      createEvent(USER_PROFILE_EVENT_TYPES.USER_AVATAR_UPLOADED, {
        avatarHash,
      }),
    );
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
  name: 'removeUserAvatar',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareProfileCommand,
  async execute(profileStore) {
    await profileStore.append(
      createEvent(USER_PROFILE_EVENT_TYPES.USER_AVATAR_REMOVED),
    );
    await profileStore.load();
    return profileStore;
  },
};

export const updateTokens: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {|
    tokens: Address[],
  |},
  UserMetadataStore,
> = {
  name: 'updateTokens',
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
          token => !currentTokens.find(currentToken => token === currentToken),
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
        .filter(currentToken => !tokens.find(token => token === currentToken))
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
  name: 'markNotificationsAsRead',
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
  name: 'subscribeToTask',
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
  name: 'unsubscribeToTask',
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
  name: 'subscribeToColony',
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
  name: 'unsubscribeToColony',
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

export const createCommentMention: Command<
  UserInboxStore[],
  {| matchingUsernames: string[], cachedAddresses: ?Object |},
  {|
    colonyAddress: Address,
    draftId: TaskDraftId,
    taskTitle: string,
    comment: string,
    sourceUsername: string,
    sourceWalletAddress: string,
  |},
  void,
> = {
  name: 'commentMentionNotification',
  context: [CONTEXT.DDB_INSTANCE, CONTEXT.ENS_INSTANCE, CONTEXT.COLONY_MANAGER],
  async prepare(
    {
      ddb,
      ens,
      colonyManager: { networkClient },
    }: { ddb: DDB, ens: ENSCache, colonyManager: ColonyManager },
    {
      matchingUsernames,
      cachedAddresses,
    }: {| matchingUsernames: string[], cachedAddresses: Object |},
  ) {
    if (!(matchingUsernames && matchingUsernames.length))
      throw new Error('No username matches');

    const usernamesToResolve = matchingUsernames.filter(
      username => !cachedAddresses[username],
    );
    const hasUsernamesToResolve =
      usernamesToResolve && usernamesToResolve.length;
    const hasCachedAddresses =
      cachedAddresses && Object.keys(cachedAddresses).length;

    const getUserInboxStoreFromProfile = ({
      walletAddress,
      inboxStoreAddress,
    }) => getUserInboxStore(ddb)({ inboxStoreAddress, walletAddress });
    if (hasCachedAddresses && !hasUsernamesToResolve) {
      return Object.values(cachedAddresses).map(getUserInboxStoreFromProfile);
    }

    const getUserAddressByUsername = async username => {
      const address = await ens.getAddress(
        ens.constructor.getFullDomain('user', username),
        networkClient,
      );
      return address;
    };

    const resolvedUserAddresses = await Promise.all(
      usernamesToResolve.map(getUserAddressByUsername),
    );

    /**
     * @todo Limit number of mentions in comments
     * @body We have to set a limit to the number of mentions an user can do or we'll get bitten by that later trying to load too many stores
     */
    const userProfileStores = await Promise.all(
      resolvedUserAddresses
        .filter(address => !!address)
        .map(walletAddress => getUserProfileStore(ddb)({ walletAddress })),
    );
    const userProfiles = userProfileStores.map(profileStore =>
      profileStore.all(),
    );
    return userProfiles.map(getUserInboxStoreFromProfile);
  },
  async execute(userInboxStores, args) {
    return userInboxStores.map(userInboxStore =>
      userInboxStore.append(
        createEvent(USER_EVENT_TYPES.COMMENT_MENTION, args),
      ),
    );
  },
};
