/* @flow */

import type { Address } from '~types';
import type {
  ColonyManager,
  ColonyStore,
  Command,
  DDB,
  Wallet,
} from '~data/types';

import { CONTEXT } from '~context';
import { createEvent } from '~data/utils';
import { COLONY_EVENT_TYPES } from '~data/constants';
import { getColonyStore, createColonyStore } from '~data/stores';
import { diffAddresses } from '~utils/arrays';
import { createAddress } from '~types';

import {
  CreateColonyProfileCommandArgsSchema,
  CreateDomainCommandArgsSchema,
  RemoveColonyAvatarCommandArgsSchema,
  SetColonyAvatarCommandArgsSchema,
  UpdateColonyProfileCommandArgsSchema,
} from './schemas';

type ColonyStoreMetadata = {|
  colonyAddress: Address,
|};

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const createColonyProfile: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    colonyAddress: Address,
    colonyName: string,
    displayName: string,
    token: {|
      address: Address,
      iconHash?: ?string,
      isExternal?: boolean,
      isNative?: ?boolean,
      name: string,
      symbol: string,
    |},
  |},
  ColonyStore,
> = {
  name: 'createColonyProfile',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    return createColonyStore(colonyClient, ddb, wallet)(metadata);
  },
  schema: CreateColonyProfileCommandArgsSchema,
  async execute(
    colonyStore,
    {
      colonyAddress,
      colonyName,
      displayName,
      token: { iconHash, isNative, isExternal, ...token },
    },
  ) {
    const profileCreatedEvent = createEvent(
      COLONY_EVENT_TYPES.COLONY_PROFILE_CREATED,
      {
        colonyAddress,
        colonyName,
        displayName,
      },
    );
    const tokenInfoAddedEvent = createEvent(
      COLONY_EVENT_TYPES.TOKEN_INFO_ADDED,
      {
        isExternal: !!isExternal,
        isNative: !!isNative,
        ...(iconHash ? { iconHash } : null),
        ...token,
      },
    );
    await colonyStore.append(profileCreatedEvent);
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
};

export const createDomain: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    name: string,
    domainId: number,
  |},
  ColonyStore,
> = {
  name: 'createDomain',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: CreateDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.DOMAIN_CREATED, args),
    );
    return colonyStore;
  },
};

export const updateColonyProfile: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    displayName: string,
    description?: string,
    guideline?: string,
    website?: string,
  |},
  ColonyStore,
> = {
  name: 'updateColonyProfile',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: UpdateColonyProfileCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.COLONY_PROFILE_UPDATED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

export const setColonyAvatar: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    ipfsHash: string,
  |},
  ColonyStore,
> = {
  name: 'setColonyAvatar',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: SetColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.COLONY_AVATAR_UPLOADED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

export const removeColonyAvatar: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    ipfsHash: string,
  |},
  ColonyStore,
> = {
  name: 'removeColonyAvatar',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: RemoveColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(
      createEvent(COLONY_EVENT_TYPES.COLONY_AVATAR_REMOVED, args),
    );
    await colonyStore.load();
    return colonyStore;
  },
};

// This is currently unused
export const addTokenInfo: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    address: Address,
    iconHash?: ?string,
    isExternal?: boolean,
    isNative?: ?boolean,
    name: string,
    symbol: string,
  |},
  ColonyStore,
> = {
  name: 'addTokenInfo',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, { iconHash, isNative, isExternal, ...args }) {
    const tokenInfoAddedEvent = createEvent(
      COLONY_EVENT_TYPES.TOKEN_INFO_ADDED,
      {
        ...(iconHash ? { iconHash } : null),
        isExternal: !!isExternal,
        isNative: !!isNative,
        ...args,
      },
    );
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
};

export const updateTokenInfo: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    tokens: Address[],
    currentTokenReferences: { [address: Address]: * },
  |},
  ColonyStore,
> = {
  name: 'updateTokenInfo',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, { tokens, currentTokenReferences = {} }) {
    // diff existing and user provided tokens
    const [add, remove] = diffAddresses(
      tokens,
      Object.keys(currentTokenReferences).map(createAddress),
    );

    // add and remove tokens as required
    await Promise.all([
      ...add.map(address =>
        colonyStore.append(
          createEvent(COLONY_EVENT_TYPES.TOKEN_INFO_ADDED, { address }),
        ),
      ),
      ...remove.map(address =>
        colonyStore.append(
          createEvent(COLONY_EVENT_TYPES.TOKEN_INFO_REMOVED, { address }),
        ),
      ),
    ]);

    await colonyStore.load();
    return colonyStore;
  },
};
