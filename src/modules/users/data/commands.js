/* @flow */

import type { Address } from '~types';
import type { TaskDraftId } from '~immutable';
import type {
  Command,
  ColonyManager,
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

import { getUserProfileReducer } from './reducers';
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
  metadataStoreAddress: string,
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
  {|
    matchingUsernames: string[],
    cachedAddresses: {
      [username: string]: {|
        walletAddress: Address,
        inboxStoreAddress: string,
      |},
    },
  |},
  {|
    colonyAddress: Address,
    draftId: TaskDraftId,
    taskTitle: string,
    comment: string,
    sourceUsername: string,
    sourceUserWalletAddress: string,
  |},
  void,
> = {
  name: 'commentMentionNotification',
  context: [CONTEXT.DDB_INSTANCE, CONTEXT.ENS_INSTANCE, CONTEXT.COLONY_MANAGER],
  /**
   * This is clearly going to return an array, filtering out null values, but
   * Flow keeps complaining about it. That disturbed MY flow state, so I'm not
   * gonna waste any more time trying to fix it.
   */
  // $FlowFixMe
  async prepare(
    {
      ddb,
      ens,
      colonyManager: { networkClient },
    }: { ddb: DDB, ens: ENSCache, colonyManager: ColonyManager },
    {
      matchingUsernames = [],
      cachedAddresses = {},
    }: {|
      matchingUsernames: string[],
      cachedAddresses: {
        [username: string]: {|
          walletAddress: Address,
          inboxStoreAddress: string,
        |},
      },
    |},
  ) {
    if (!matchingUsernames.length) throw new Error('No username matches');

    const getUserInboxStoreFromProfile = (
      profile: ?{|
        walletAddress: Address,
        inboxStoreAddress: string,
      |},
    ) => {
      const { walletAddress, inboxStoreAddress } = profile || {};
      if (!(inboxStoreAddress && walletAddress)) return null;
      return getUserInboxStore(ddb)({
        walletAddress,
        inboxStoreAddress,
      });
    };

    const getUserAddressByUsername = (username: string) =>
      ens.getAddress(
        ens.constructor.getFullDomain('user', username),
        networkClient,
      );
    const getUserProfile = async (walletAddress: ?Address) => {
      if (!walletAddress) return null;
      const profileStore = await getUserProfileStore(ddb)({ walletAddress });
      if (!profileStore) return null;
      const {
        inboxStoreAddress,
        walletAddress: profileWalletAddress,
      } = profileStore.all().reduce(getUserProfileReducer, {
        /*
         * We can be pretty sure that `walletAddress` will be in the first
         * event for this store, but flow doesn't know that.
         */
        inboxStoreAddress: '',
        metadataStoreAddress: '',
        walletAddress: '',
      });

      return {
        inboxStoreAddress,
        walletAddress: profileWalletAddress,
      };
    };

    const usernamesToResolve =
      matchingUsernames.filter(username => !cachedAddresses[username]) || [];
    if (Object.keys(cachedAddresses).length && !usernamesToResolve.length) {
      const cachedProfiles = Object.keys(cachedAddresses)
        .filter(key => !!cachedAddresses[key])
        .map(key => cachedAddresses[key]);

      return Promise.all(
        cachedProfiles && cachedProfiles.map(getUserInboxStoreFromProfile),
      );
    }

    const resolvedWalletAddresses = await Promise.all(
      usernamesToResolve && usernamesToResolve.map(getUserAddressByUsername),
    );

    /**
     * @todo Limit number of mentions in comments
     * @body We have to set a limit to the number of mentions an user can do or we'll get bitten by that later trying to load too many stores
     */
    const userProfiles = await Promise.all(
      resolvedWalletAddresses && resolvedWalletAddresses.map(getUserProfile),
    );

    const inboxStores = await Promise.all(
      userProfiles && userProfiles.map(getUserInboxStoreFromProfile),
    );

    return inboxStores && inboxStores.filter(Boolean);
  },
  async execute(userInboxStores, args) {
    if (!(userInboxStores && userInboxStores.length)) return;
    await Promise.all(
      userInboxStores.map(inboxStore =>
        inboxStore.append(createEvent(USER_EVENT_TYPES.COMMENT_MENTION, args)),
      ),
    );
  },
};
