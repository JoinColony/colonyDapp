/* @flow */

import type { Address } from '~types';
import type { EventStore } from '~lib/database/stores';
import type {
  ColonyClientContext,
  Command,
  ContextWithMetadata,
  DDBContext,
  WalletContext,
} from '~data/types';

import { diffAddresses } from '~utils/arrays';
import { getColonyStore, createColonyStore } from '~data/stores';
import {
  createColonyAvatarRemovedEvent,
  createColonyAvatarUploadedEvent,
  createColonyProfileCreatedEvent,
  createColonyProfileUpdatedEvent,
  createDomainCreatedEvent,
  createTokenInfoAddedEvent,
  createTokenInfoRemovedEvent,
} from '../events';

import { getColony } from '../queries';

import {
  CreateColonyProfileCommandArgsSchema,
  CreateDomainCommandArgsSchema,
  RemoveColonyAvatarCommandArgsSchema,
  SetColonyAvatarCommandArgsSchema,
  UpdateColonyProfileCommandArgsSchema,
} from './schemas';

export type ColonyContext = ContextWithMetadata<
  {|
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
    colonyName: string,
    displayName: string,
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
      colonyName,
      displayName,
      description,
      guideline,
      website,
      token,
    } = args;
    const profileCreatedEvent = createColonyProfileCreatedEvent({
      colonyAddress,
      colonyName,
      displayName,
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
    id: number,
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
    displayName?: string,
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

export const updateTokenInfo: ColonyCommand<
  {|
    tokens: Address[],
  |},
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute(args) {
    const { tokens } = args;
    const { tokens: currentTokenReferences = {} } = await getColony({
      colonyClient,
      ddb,
      wallet,
      metadata,
    }).execute();
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

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
});
