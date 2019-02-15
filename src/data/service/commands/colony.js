/* @flow */

import pSeries from 'p-series';

import type { Address, ENSName } from '~types';
import type {
  ColonyClientContext,
  Command,
  Context,
  DDBContext,
  WalletContext,
} from '../../types';
import type { EventStore } from '../../../lib/database/stores';

import { getColonyStore, createColonyStore } from '../../stores';
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

export type ColonyContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
  |},
  ColonyClientContext & WalletContext & DDBContext,
>;

export type ColonyCommand<I: *, R: *> = Command<ColonyContext, I, R>;

type CreateColonyProfileCommandArgs = {|
  address: Address,
  ensName: string,
  name: string,
  description?: string,
  guideline?: string,
  website?: string,
  token: {|
    address: Address,
    name: string,
    symbol: string,
    icon: string,
  |},
|};

type UpdateColonyProfileCommandArgs = {|
  name?: string,
  description?: string,
  guideline?: string,
  website?: string,
|};

type SetColonyAvatarCommandArgs = {|
  avatar: string,
  ipfsHash: string,
|};

type RemoveColonyAvatarCommandArgs = {|
  ipfsHash: string,
|};

type CreateDomainCommandArgs = {|
  name: string,
  domainId: number,
|};

export const createColonyProfile: ColonyCommand<
  CreateColonyProfileCommandArgs,
  EventStore,
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
  metadata,
}) => ({
  schema: CreateColonyProfileCommandArgsSchema,
  async execute({ name, description, guideline, website, token }) {
    const profileCreatedEvent = createColonyProfileCreatedEvent({
      address: colonyAddress,
      ensName: colonyENSName,
      name,
      description,
      guideline,
      website,
    });
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(token);
    const colonyStore = await createColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.load();

    await pSeries(
      [profileCreatedEvent, tokenInfoAddedEvent].map(event =>
        colonyStore.append(event),
      ),
    );

    return colonyStore;
  },
});

export const createDomain: ColonyCommand<
  CreateDomainCommandArgs,
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
  UpdateColonyProfileCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: UpdateColonyProfileCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyProfileUpdatedEvent(args));
    return colonyStore;
  },
});

export const setColonyAvatar: ColonyCommand<
  SetColonyAvatarCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: SetColonyAvatarCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyAvatarUploadedEvent(args));
    return colonyStore;
  },
});

export const removeColonyAvatar: ColonyCommand<
  RemoveColonyAvatarCommandArgs,
  EventStore,
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  schema: RemoveColonyAvatarCommandArgsSchema,
  async execute(args) {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    await colonyStore.append(createColonyAvatarRemovedEvent(args));
    return colonyStore;
  },
});
