import gql from 'graphql-tag';
import ApolloClient from 'apollo-client';

import { Address, ExcludesNull } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import {
  Command,
  ColonyManager,
  DDB,
  ENSCache,
  UserInboxStore,
  UserMetadataStore,
  UserProfileStore,
} from '~data/types';
import { Context } from '~context/index';
import { log } from '~utils/debug';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import {
  createUserProfileStore,
  getUserProfileStore,
  getUserMetadataStore,
} from '~data/stores';
import { createEvent } from '~data/utils';
import { EventTypes } from '~data/constants';

import {
  getUserTokenAddresses,
  getUserInboxStoreByProfileAddress,
  getUserAddressByUsername,
} from './utils';

import {
  CreateAssignedCommandArgsSchema,
  CreateUnassignedCommandArgsSchema,
  CreateCommentMentionCommandArgsSchema,
  CreateFinalizedCommandArgsSchema,
  CreateUserProfileCommandArgsSchema,
  CreateWorkRequestCommandArgsSchema,
  MarkNotificationsAsReadCommandArgsSchema,
  SetUserAvatarCommandArgsSchema,
  UpdateUserProfileCommandArgsSchema,
  UserUpdateTokensCommandArgsSchema,
} from './schemas';

type UserProfileStoreMetadata = {
  walletAddress: Address;
};

type UserMetadataStoreMetadata = {
  metadataStoreAddress: string;
  walletAddress: Address;
};

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $address: String!) {
    createUser(username: $username, address: $address) {
      profile {
        username
        walletAddress
      }
    }
  }
`;

const prepareProfileCommand = async (
  { ddb }: { ddb: DDB },
  metadata: UserProfileStoreMetadata,
) => getUserProfileStore(ddb)(metadata);

const prepareMetadataCommand = async (
  { ddb }: { ddb: DDB },
  metadata: UserMetadataStoreMetadata,
) => getUserMetadataStore(ddb)(metadata);

export const createUserProfile: Command<
  {
    apolloClient: ApolloClient<any>;
    profileStore: UserProfileStore;
    inboxStore: UserInboxStore;
    metadataStore: UserMetadataStore;
  },
  UserProfileStoreMetadata,
  {
    username: string;
    walletAddress: Address;
  },
  {
    profileStore: UserProfileStore;
    inboxStore: UserInboxStore;
    metadataStore: UserMetadataStore;
  }
> = {
  name: 'createUserProfile',
  context: [Context.DDB_INSTANCE, Context.APOLLO_CLIENT],
  schema: CreateUserProfileCommandArgsSchema,
  async prepare({ ddb, apolloClient }, metadata: UserProfileStoreMetadata) {
    const stores = await createUserProfileStore(ddb)(metadata);
    return {
      ...stores,
      apolloClient,
    };
  },
  async execute(
    { profileStore, inboxStore, metadataStore, apolloClient },
    args,
  ) {
    // @TODO_GRAPHQL remove
    /* Old ddb stuff */
    await profileStore.append(
      createEvent(EventTypes.USER_PROFILE_CREATED, {
        inboxStoreAddress: inboxStore.address.toString(),
        metadataStoreAddress: metadataStore.address.toString(),
        ...args,
      }),
    );
    await profileStore.load();

    /* New server stuff */
    await apolloClient.mutate({
      mutation: CREATE_USER,
      variables: {
        address: args.walletAddress,
        username: args.username,
      },
    });

    /* Old returns */
    return { profileStore, inboxStore, metadataStore };
  },
};

export const updateUserProfile: Command<
  UserProfileStore,
  UserProfileStoreMetadata,
  {
    bio?: string;
    displayName?: string;
    location?: string;
    website?: string;
  },
  UserProfileStore
> = {
  name: 'updateUserProfile',
  context: [Context.DDB_INSTANCE],
  schema: UpdateUserProfileCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, args) {
    await profileStore.append(
      createEvent(EventTypes.USER_PROFILE_UPDATED, args),
    );
    await profileStore.load();
    return profileStore;
  },
};

export const setUserAvatar: Command<
  UserProfileStore,
  UserProfileStoreMetadata,
  {
    ipfsHash: string;
  },
  string
> = {
  name: 'setUserAvatar',
  context: [Context.DDB_INSTANCE],
  schema: SetUserAvatarCommandArgsSchema,
  prepare: prepareProfileCommand,
  async execute(profileStore, { ipfsHash: avatarHash }) {
    await profileStore.append(
      createEvent(EventTypes.USER_AVATAR_UPLOADED, {
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
  UserProfileStore
> = {
  name: 'removeUserAvatar',
  context: [Context.DDB_INSTANCE],
  prepare: prepareProfileCommand,
  async execute(profileStore) {
    await profileStore.append(createEvent(EventTypes.USER_AVATAR_REMOVED));
    await profileStore.load();
    return profileStore;
  },
};

export const updateTokens: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {
    tokens: Address[];
  },
  UserMetadataStore
> = {
  name: 'updateTokens',
  context: [Context.DDB_INSTANCE],
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
            createEvent(EventTypes.TOKEN_ADDED, { address }),
          ),
        ),
    );

    // remove tokens from store which have been removed by user
    await Promise.all(
      currentTokens
        .filter(currentToken => !tokens.find(token => token === currentToken))
        .map(address =>
          userMetadataStore.append(
            createEvent(EventTypes.TOKEN_REMOVED, { address }),
          ),
        ),
    );

    return userMetadataStore;
  },
};

export const markNotificationsAsRead: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {
    readUntil: number;
    exceptFor: string[];
  },
  UserMetadataStore
> = {
  name: 'markNotificationsAsRead',
  context: [Context.DDB_INSTANCE],
  schema: MarkNotificationsAsReadCommandArgsSchema,
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, args) {
    const { readUntil, exceptFor } = args;
    await userMetadataStore.append(
      createEvent(EventTypes.READ_UNTIL, { readUntil, exceptFor }),
    );
    return userMetadataStore;
  },
};

export const subscribeToTask: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    userDraftIds: [Address, TaskDraftId][];
  },
  TaskDraftId | null
> = {
  name: 'subscribeToTask',
  context: [Context.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, draftId, userDraftIds }) {
    const draftIds = userDraftIds
      .filter(([userColonyAddress]) => userColonyAddress === colonyAddress)
      .map(([, userDraftId]) => userDraftId);

    if (draftIds.includes(draftId)) {
      return null;
    }
    await userMetadataStore.append(
      createEvent(EventTypes.SUBSCRIBED_TO_TASK, {
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
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    userDraftIds: TaskDraftId[];
  },
  TaskDraftId | null
> = {
  name: 'unsubscribeToTask',
  context: [Context.DDB_INSTANCE],
  prepare: prepareMetadataCommand,
  async execute(userMetadataStore, { colonyAddress, draftId, userDraftIds }) {
    const draftIds = userDraftIds
      // @ts-ignore
      .filter(([userColonyAddress]) => userColonyAddress === colonyAddress)
      // @ts-ignore
      .map(([, userDraftId]) => userDraftId);

    if (!draftIds.includes(draftId)) {
      return null;
    }

    await userMetadataStore.append(
      createEvent(EventTypes.UNSUBSCRIBED_FROM_TASK, {
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
  {
    colonyAddress: Address;
    userColonyAddresses: Address[];
  },
  Address | null
> = {
  name: 'subscribeToColony',
  context: [Context.DDB_INSTANCE],
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
      createEvent(EventTypes.SUBSCRIBED_TO_COLONY, { colonyAddress }),
    );
    return colonyAddress;
  },
};

export const unsubscribeToColony: Command<
  UserMetadataStore,
  UserMetadataStoreMetadata,
  {
    colonyAddress: Address;
    userColonyAddresses: Address[];
  },
  Address | null
> = {
  name: 'unsubscribeToColony',
  context: [Context.DDB_INSTANCE],
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
      createEvent(EventTypes.UNSUBSCRIBED_FROM_COLONY, { colonyAddress }),
    );
    return colonyAddress;
  },
};

export const createCommentMention: Command<
  UserInboxStore[],
  {
    matchingUsernames: string[];
  },
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    taskTitle: string;
    comment: string;
    sourceUserAddress: Address;
  },
  void
> = {
  name: 'commentMentionNotification',
  context: [Context.DDB_INSTANCE, Context.ENS_INSTANCE, Context.COLONY_MANAGER],
  schema: CreateCommentMentionCommandArgsSchema,
  async prepare(
    {
      ddb,
      ens,
      colonyManager: { networkClient },
    }: { ddb: DDB; ens: ENSCache; colonyManager: ColonyManager },
    {
      matchingUsernames = [],
    }: {
      matchingUsernames: string[];
    },
  ) {
    if (!matchingUsernames.length) return [];

    const getUserAddress = getUserAddressByUsername(ens, networkClient);

    const getInboxStore = async (walletAddress: Address) => {
      try {
        const inboxStore = await getUserInboxStoreByProfileAddress(ddb)({
          walletAddress,
        });
        return inboxStore;
      } catch (caughtError) {
        log.warn(caughtError);
        return null;
      }
    };

    const addresses = await Promise.all(matchingUsernames.map(getUserAddress));

    const inboxStores = await Promise.all(
      addresses.filter(Boolean).map(getInboxStore),
    );

    return inboxStores.filter((Boolean as any) as ExcludesNull);
  },
  async execute(userInboxStores, args) {
    if (!(userInboxStores && userInboxStores.length)) return;
    await Promise.all(
      userInboxStores.map(inboxStore =>
        inboxStore.append(createEvent(EventTypes.COMMENT_MENTION, args)),
      ),
    );
  },
};

export const createAssignedInboxEvent: Command<
  UserInboxStore,
  {
    workerAddress: Address;
  },
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    taskTitle: string;
    sourceUserAddress: Address;
  },
  void
> = {
  name: 'createAssignedNotification',
  context: [Context.DDB_INSTANCE],
  schema: CreateAssignedCommandArgsSchema,
  async prepare({ ddb }, { workerAddress }) {
    return getUserInboxStoreByProfileAddress(ddb)({
      walletAddress: workerAddress,
    });
  },
  async execute(inboxStore, args) {
    await inboxStore.append(createEvent(EventTypes.ASSIGNED_TO_TASK, args));
  },
};

export const createUnassignedInboxEvent: Command<
  UserInboxStore,
  {
    workerAddress: Address;
  },
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    taskTitle: string;
    sourceUserAddress: Address;
  },
  void
> = {
  name: 'createUnassignedNotification',
  context: [Context.DDB_INSTANCE],
  schema: CreateUnassignedCommandArgsSchema,
  async prepare({ ddb }, { workerAddress }) {
    return getUserInboxStoreByProfileAddress(ddb)({
      walletAddress: workerAddress,
    });
  },
  async execute(inboxStore, args) {
    await inboxStore.append(createEvent(EventTypes.UNASSIGNED_FROM_TASK, args));
  },
};

export const createWorkRequestInboxEvent: Command<
  UserInboxStore,
  {
    managerAddress: Address;
  },
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    taskTitle: string;
    sourceUserAddress: Address;
  },
  void
> = {
  name: 'createWorkRequestInboxEvent',
  context: [Context.DDB_INSTANCE],
  schema: CreateWorkRequestCommandArgsSchema,
  async prepare({ ddb }, { managerAddress }) {
    return getUserInboxStoreByProfileAddress(ddb)({
      walletAddress: managerAddress,
    });
  },
  async execute(inboxStore, args) {
    await inboxStore.append(createEvent(EventTypes.WORK_REQUEST, args));
  },
};

export const createFinalizedInboxEvent: Command<
  UserInboxStore,
  {
    workerAddress: Address;
  },
  {
    colonyAddress: Address;
    draftId: TaskDraftId;
    taskTitle: string;
    sourceUserAddress: Address;
  },
  any
> = {
  name: 'createFinalizedInboxEvent',
  context: [Context.DDB_INSTANCE],
  schema: CreateFinalizedCommandArgsSchema,
  async prepare({ ddb }, { workerAddress }) {
    return getUserInboxStoreByProfileAddress(ddb)({
      walletAddress: workerAddress,
    });
  },
  async execute(inboxStore, args) {
    await inboxStore.append(
      createEvent(EventTypes.TASK_FINALIZED_NOTIFICATION, args),
    );
  },
};
