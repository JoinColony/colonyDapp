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
import { getColonyStore, createColonyStore } from '~data/stores';
import { diffAddresses } from '~utils/arrays';
import {
  createColonyAvatarRemovedEvent,
  createColonyAvatarUploadedEvent,
  createColonyProfileCreatedEvent,
  createColonyProfileUpdatedEvent,
  createDomainCreatedEvent,
  createTokenInfoAddedEvent,
  createTokenInfoRemovedEvent,
} from '../events';

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
    description?: string,
    guideline?: string,
    website?: string,
    token: {|
      address: Address,
      icon?: ?string,
      isNative?: ?boolean,
      name: string,
      symbol: string,
    |},
  |},
  ColonyStore,
> = {
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
      description,
      guideline,
      website,
      token,
    },
  ) {
    const profileCreatedEvent = createColonyProfileCreatedEvent({
      colonyAddress,
      colonyName,
      displayName,
      description,
      guideline,
      website,
    });
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(token);
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
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: CreateDomainCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createDomainCreatedEvent(args));
    return colonyStore;
  },
};

export const updateColonyProfile: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    displayName?: string,
    description?: string,
    guideline?: string,
    website?: string,
  |},
  ColonyStore,
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: UpdateColonyProfileCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createColonyProfileUpdatedEvent(args));
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
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: SetColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createColonyAvatarUploadedEvent(args));
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
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  schema: RemoveColonyAvatarCommandArgsSchema,
  async execute(colonyStore, args) {
    await colonyStore.append(createColonyAvatarRemovedEvent(args));
    await colonyStore.load();
    return colonyStore;
  },
};

export const addTokenInfo: Command<
  ColonyStore,
  ColonyStoreMetadata,
  {|
    address: Address,
    icon?: ?string,
    isNative?: ?boolean,
    name: string,
    symbol: string,
  |},
  ColonyStore,
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, args) {
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(args);
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
    currentTokenReferences: Object,
  |},
  ColonyStore,
> = {
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore, { tokens, currentTokenReferences = {} }) {
    // diff existing and user provided tokens
    const [add, remove] = diffAddresses(
      tokens,
      Object.keys(currentTokenReferences),
    );

    // add and remove tokens as required
    await Promise.all([
      ...add.map(address =>
        colonyStore.append(createTokenInfoAddedEvent({ address })),
      ),
      ...remove.map(address =>
        colonyStore.append(createTokenInfoRemovedEvent({ address })),
      ),
    ]);

    await colonyStore.load();
    return colonyStore;
  },
};
