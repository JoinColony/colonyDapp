/* @flow */

import type { Address, ENSName } from '~types';
import type { EventStore } from '~lib/database/stores';
import type {
  ColonyClientContext,
  Command,
  ContextWithMetadata,
  DDBContext,
  WalletContext,
} from '~data/types';

import { getColonyStore, createColonyStore } from '~data/stores';
import {
  createColonyAvatarRemovedEvent,
  createColonyAvatarUploadedEvent,
  createColonyProfileCreatedEvent,
  createColonyProfileUpdatedEvent,
  createDomainCreatedEvent,
  createTokenInfoAddedEvent,
} from '../events';

import {
  CreateColonyProfileCommandArgsSchema,
  CreateDomainCommandArgsSchema,
  RemoveColonyAvatarCommandArgsSchema,
  SetColonyAvatarCommandArgsSchema,
  UpdateColonyProfileCommandArgsSchema,
} from './schemas';

export type ColonyContext = ContextWithMetadata<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
  |},
  ColonyClientContext & WalletContext & DDBContext,
>;

export type ColonyCommand<I: *, R: *> = Command<ColonyContext, I, R>;

type AddTokenInfoCommandArgs = {|
  address: Address,
  icon?: ?string,
  isNative?: ?boolean,
  name: string,
  symbol: string,
|};

export const createColonyProfile: ColonyCommand<
  {|
    colonyAddress: Address,
    ensName: string,
    name: string,
    description?: string,
    guideline?: string,
    website?: string,
    token: AddTokenInfoCommandArgs,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CreateColonyProfileCommandArgsSchema,
  async execute(args) {
    const {
      colonyAddress,
      ensName,
      name,
      description,
      guideline,
      website,
      token,
    } = args;
    const profileCreatedEvent = createColonyProfileCreatedEvent({
      colonyAddress,
      ensName,
      name,
      description,
      guideline,
      website,
    });
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(token);
    const colonyStore = await createColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    await colonyStore.append(profileCreatedEvent);
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
});

export const createDomain: ColonyCommand<
  {|
    name: string,
    domainId: number,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: CreateDomainCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createDomainCreatedEvent(args));
    return colonyStore;
  },
});

export const updateColonyProfile: ColonyCommand<
  {|
    name?: string,
    description?: string,
    guideline?: string,
    website?: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: UpdateColonyProfileCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyProfileUpdatedEvent(args));
    await colonyStore.load();
    return colonyStore;
  },
});

export const setColonyAvatar: ColonyCommand<
  {|
    ipfsHash: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetColonyAvatarCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyAvatarUploadedEvent(args));
    await colonyStore.load();
    return colonyStore;
  },
});

export const removeColonyAvatar: ColonyCommand<
  {|
    ipfsHash: string,
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: RemoveColonyAvatarCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyAvatarRemovedEvent(args));
    await colonyStore.load();
    return colonyStore;
  },
});

export const addTokenInfo: ColonyCommand<
  AddTokenInfoCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute(args) {
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(args);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(tokenInfoAddedEvent);
    await colonyStore.load();
    return colonyStore;
  },
});
