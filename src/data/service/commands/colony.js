/* @flow */

import pSeries from 'p-series';

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { EventStore } from '../../../lib/database/stores';
import type { DDB } from '../../../lib/database';
import type {
  Command,
  CreateColonyCommandArgs,
  CreateDomainCommandArgs,
  RemoveColonyAvatarCommandArgs,
  UploadColonyAvatarCommandArgs,
  UpdateColonyProfileCommandArgs,
} from './types';

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
  validate,
  CreateColonyCommandArgsSchema,
  CreateDomainCommandArgsSchema,
  RemoveColonyAvatarCommandArgsSchema,
  UploadColonyAvatarCommandArgsSchema,
  UpdateColonyProfileCommandArgsSchema,
} from './schemas';

// eslint-disable-next-line import/prefer-default-export
export const createColony = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<CreateColonyCommandArgs> => ({
  async execute(args: CreateColonyCommandArgs) {
    const {
      address,
      colonyId,
      ensName,
      name,
      description,
      guideline,
      website,
      token,
    } = await validate(CreateColonyCommandArgsSchema)(args);

    const profileCreatedEvent = createColonyProfileCreatedEvent({
      address,
      colonyId,
      ensName,
      name,
      description,
      guideline,
      website,
    });
    const tokenInfoAddedEvent = createTokenInfoAddedEvent(token);

    // @TODO: Put it on app state somehow
    const colonyStore: EventStore = (await createColonyStore(
      colonyClient,
      ddb,
      wallet,
    )({
      colonyAddress: address,
    }): any);

    // @TODO: Do we return the result or the store?
    return pSeries(
      [profileCreatedEvent, tokenInfoAddedEvent].map(event =>
        colonyStore.append(event),
      ),
    );
  },
});

export const createDomain = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<CreateDomainCommandArgs> => ({
  async execute(args: CreateDomainCommandArgs) {
    const { domainId, ensName } = await validate(CreateDomainCommandArgsSchema)(
      args,
    );

    const colonyStore: EventStore = (await getColonyStore(
      colonyClient,
      ddb,
      wallet,
    )(ensName): any);

    await colonyStore.append(
      createDomainCreatedEvent({
        domainId,
        colonyENSName: ensName,
      }),
    );

    await colonyStore.load();
  },
});

// @FIXME: Maybe we should call these command creators as well and use the `createX` naming?
export const updateColonyProfile = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<UpdateColonyProfileCommandArgs> => ({
  async execute(args: UpdateColonyProfileCommandArgs) {
    const { ensName, name, description, guideline, website } = await validate(
      UpdateColonyProfileCommandArgsSchema,
    )(args);

    const colonyStore: EventStore = (await getColonyStore(
      colonyClient,
      ddb,
      wallet,
    )(ensName): any);

    await colonyStore.append(
      createColonyProfileUpdatedEvent({
        name,
        description,
        guideline,
        website,
      }),
    );

    await colonyStore.load();
  },
});

export const uploadColonyAvatar = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<UploadColonyAvatarCommandArgs> => ({
  async execute(args: UploadColonyAvatarCommandArgs) {
    const { ensName, ipfsHash, avatar } = await validate(
      UploadColonyAvatarCommandArgsSchema,
    )(args);

    const colonyStore: EventStore = (await getColonyStore(
      colonyClient,
      ddb,
      wallet,
    )(ensName): any);

    await colonyStore.append(
      createColonyAvatarUploadedEvent({ ipfsHash, avatar }),
    );

    await colonyStore.load();
  },
});

export const removeColonyAvatar = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<RemoveColonyAvatarCommandArgs> => ({
  async execute(args: RemoveColonyAvatarCommandArgs) {
    const { ipfsHash, ensName } = await validate(
      RemoveColonyAvatarCommandArgsSchema,
    )(args);

    const colonyStore: EventStore = (await getColonyStore(
      colonyClient,
      ddb,
      wallet,
    )(ensName): any);

    await colonyStore.append(createColonyAvatarRemovedEvent({ ipfsHash }));

    await colonyStore.load();
  },
});
