/* @flow */

import type { Address } from '~types';
import type { Event, EventCreator, EventPayload } from './types';

import { decoratePayload } from './utils';
import { COLONY_EVENT_TYPES } from '../constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_CREATED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

type DomainCreatedEventArgs = {|
  domainId: number,
  colonyENSName: string,
|};
type DomainCreatedEventPayload = EventPayload & DomainCreatedEventArgs;
type DomainCreatedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  DomainCreatedEventPayload,
>;

type TaskStoreCreatedEventArgs = {|
  taskStoreAddress: string,
  draftId: string,
  domainId: number,
|};
type TaskStoreCreatedEventPayload = EventPayload & TaskStoreCreatedEventArgs;
type TaskStoreCreatedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  TaskStoreCreatedEventPayload,
>;

type ColonyAvatarUploadedEventArgs = {|
  ipfsHash: string,
  avatar: string,
|};
type ColonyAvatarUploadedEventPayload = EventPayload &
  ColonyAvatarUploadedEventArgs;
type ColonyAvatarUploadedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  ColonyAvatarUploadedEventPayload,
>;

type ColonyAvatarRemovedEventArgs = {|
  ipfsHash: string,
|};
type ColonyAvatarRemovedEventPayload = EventPayload &
  ColonyAvatarRemovedEventArgs;
type ColonyAvatarRemovedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  ColonyAvatarRemovedEventPayload,
>;

type TokenInfoAddedEventArgs = {|
  address: Address,
  icon: string,
  name: string,
  symbol: string,
|};
type TokenInfoAddedEventPayload = EventPayload & TokenInfoAddedEventArgs;
type TokenInfoAddedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  TokenInfoAddedEventPayload,
>;

type ColonyProfileCreatedEventArgs = {|
  address: Address,
  ensName: string,
  name: string,
  description: string,
  website: string,
  guideline: string,
|};
type ColonyProfileCreatedEventPayload = EventPayload &
  ColonyProfileCreatedEventArgs;
type ColonyProfileCreatedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  ColonyProfileCreatedEventPayload,
>;

type ColonyProfileUpdatedEventArgs = {|
  name: string,
  description: string,
  website: string,
  guideline: string,
|};
type ColonyProfileUpdatedEventPayload = EventPayload &
  ColonyProfileUpdatedEventArgs;

type ColonyProfileUpdatedEvent = Event<
  $Keys<typeof COLONY_EVENT_TYPES>,
  ColonyProfileUpdatedEventPayload,
>;

export const createDomainCreatedEvent: EventCreator<
  DomainCreatedEventArgs,
  DomainCreatedEvent,
> = ({ domainId }) => ({
  type: DOMAIN_CREATED,
  payload: decoratePayload<DomainCreatedEventPayload>({
    domainId,
  }),
});
export const createTaskStoreCreatedEvent: EventCreator<
  TaskStoreCreatedEventArgs,
  TaskStoreCreatedEvent,
> = ({ domainId, taskStoreAddress, draftId }) => ({
  type: TASK_STORE_CREATED,
  payload: decoratePayload<TaskStoreCreatedEventPayload>({
    domainId,
    taskStoreAddress,
    draftId,
  }),
});

export const createColonyAvatarRemovedEvent: EventCreator<
  ColonyAvatarRemovedEventArgs,
  ColonyAvatarRemovedEvent,
> = ({ ipfsHash }) => ({
  type: AVATAR_REMOVED,
  payload: decoratePayload<ColonyAvatarRemovedEventPayload>({ ipfsHash }),
});

export const createColonyAvatarUploadedEvent: EventCreator<
  ColonyAvatarUploadedEventArgs,
  ColonyAvatarUploadedEvent,
> = ({ ipfsHash, avatar }) => ({
  type: AVATAR_UPLOADED,
  payload: decoratePayload<ColonyAvatarUploadedEventPayload>({
    avatar,
    ipfsHash,
  }),
});

export const createColonyProfileCreatedEvent: EventCreator<
  ColonyProfileCreatedEventArgs,
  ColonyProfileCreatedEvent,
> = ({ address, ensName, name, description, website, guideline }) => ({
  type: PROFILE_CREATED,
  payload: decoratePayload<ColonyProfileCreatedEventPayload>({
    address,
    ensName,
    name,
    description,
    website,
    guideline,
  }),
});

export const createColonyProfileUpdatedEvent: EventCreator<
  ColonyProfileUpdatedEventArgs,
  ColonyProfileUpdatedEvent,
> = ({ description, website, guideline }) => ({
  type: PROFILE_UPDATED,
  payload: decoratePayload<ColonyProfileUpdatedEventPayload>({
    description,
    website,
    guideline,
  }),
});

export const createTokenInfoAddedEvent: EventCreator<
  TokenInfoAddedEventArgs,
  TokenInfoAddedEvent,
> = ({ address, icon, name, symbol }) => ({
  type: TOKEN_INFO_ADDED,
  payload: decoratePayload<TokenInfoAddedEventPayload>({
    address,
    icon,
    name,
    symbol,
  }),
});
