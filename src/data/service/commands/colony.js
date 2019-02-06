/* @flow */

import pSeries from 'p-series';

import type { Address, ENSName } from '~types';
import type { Command, ContractContext } from '../../types';
import type { EventStore } from '../../../lib/database/stores';

import { getColonyStore, createColonyStore } from '../../stores';
import { validate } from '../../utils';
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

export type ColonyContext = ContractContext<{|
  colonyENSName: string | ENSName,
  colonyAddress: Address,
|}>;
export type ColonyCommand<I: *, R: *> = Command<ColonyContext, I, R>;

type CreateColonyProfileCommandArgs = {|
  address: Address,
  colonyId: string,
  ensName: string,
  name: string,
  description: string,
  guideline: string,
  website: string,
  token: {|
    address: Address,
    name: string,
    symbol: string,
    icon: string,
  |},
|};

type UpdateColonyProfileCommandArgs = {|
  name: string,
  description: string,
  guideline: string,
  website: string,
|};

type SetColonyAvatarCommandArgs = {|
  address: Address,
  ensName: string,
  avatar: string,
  ipfsHash: string,
|};

type RemoveColonyAvatarCommandArgs = {|
  address: Address,
  ensName: string,
  ipfsHash: string,
|};

type CreateDomainCommandArgs = {|
  address: Address,
  ensName: string,
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
}) => ({
  async validate(args) {
    return validate(CreateColonyProfileCommandArgsSchema)(args);
  },
  async execute(args) {
    const { name, description, guideline, website, token } = args;
    const profileCreatedEvent = createColonyProfileCreatedEvent({
      address: colonyAddress,
      ensName: colonyENSName,
      name,
      description,
      guideline,
      website,
    });
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(token);

    const colonyStore = await createColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
    });
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
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(CreateDomainCommandArgsSchema)(args);
  },
  async execute(args) {
    const { domainId } = args;
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    await colonyStore.append(
      createDomainCreatedEvent({
        domainId,
        colonyENSName,
      }),
    );

    return colonyStore;
  },
});

export const updateColonyProfile: ColonyCommand<
  UpdateColonyProfileCommandArgs,
  EventStore,
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(UpdateColonyProfileCommandArgsSchema)(args);
  },
  async execute(args) {
    const { name, description, guideline, website } = args;
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    await colonyStore.append(
      createColonyProfileUpdatedEvent({
        name,
        description,
        guideline,
        website,
      }),
    );

    return colonyStore;
  },
});

export const setColonyAvatar: ColonyCommand<
  SetColonyAvatarCommandArgs,
  EventStore,
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(SetColonyAvatarCommandArgsSchema)(args);
  },
  async execute(args) {
    const { ipfsHash, avatar } = args;
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    await colonyStore.append(
      createColonyAvatarUploadedEvent({ ipfsHash, avatar }),
    );

    return colonyStore;
  },
});

export const removeColonyAvatar: ColonyCommand<
  RemoveColonyAvatarCommandArgs,
  EventStore,
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async validate(args) {
    return validate(RemoveColonyAvatarCommandArgsSchema)(args);
  },
  async execute(args) {
    const { ipfsHash } = args;
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    await colonyStore.append(createColonyAvatarRemovedEvent({ ipfsHash }));
    return colonyStore;
  },
});
