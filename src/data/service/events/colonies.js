/* @flow */

import type { Address } from '~types';
import type { Event, EventCreator, EventPayload } from '../../types';

import { decoratePayload } from '../../utils';
import { COLONY_EVENT_TYPES } from '../../constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_CREATED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

export type DomainCreatedEventArgs = {|
  domainId: number,
  colonyENSName: string,
|};
export type DomainCreatedEventPayload = EventPayload & DomainCreatedEventArgs;
export type DomainCreatedEvent = Event<
  typeof DOMAIN_CREATED,
  DomainCreatedEventPayload,
>;

export type TaskStoreCreatedEventArgs = {|
  taskStoreAddress: string,
  draftId: string,
  domainId: number,
|};
export type TaskStoreCreatedEventPayload = EventPayload &
  TaskStoreCreatedEventArgs;
export type TaskStoreCreatedEvent = Event<
  typeof TASK_STORE_CREATED,
  TaskStoreCreatedEventPayload,
>;

export type ColonyAvatarUploadedEventArgs = {|
  ipfsHash: string,
  avatar: string,
|};
export type ColonyAvatarUploadedEventPayload = EventPayload &
  ColonyAvatarUploadedEventArgs;
export type ColonyAvatarUploadedEvent = Event<
  typeof AVATAR_UPLOADED,
  ColonyAvatarUploadedEventPayload,
>;

export type ColonyAvatarRemovedEventArgs = {|
  ipfsHash: string,
|};
export type ColonyAvatarRemovedEventPayload = EventPayload &
  ColonyAvatarRemovedEventArgs;
export type ColonyAvatarRemovedEvent = Event<
  typeof AVATAR_REMOVED,
  ColonyAvatarRemovedEventPayload,
>;

export type TokenInfoAddedEventArgs = {|
  address: Address,
  icon: string,
  name: string,
  symbol: string,
|};
export type TokenInfoAddedEventPayload = EventPayload & TokenInfoAddedEventArgs;
export type TokenInfoAddedEvent = Event<
  typeof TOKEN_INFO_ADDED,
  TokenInfoAddedEventPayload,
>;

export type ColonyProfileCreatedEventArgs = {|
  address: Address,
  ensName: string,
  name: string,
  description: string,
  website: string,
  guideline: string,
|};
export type ColonyProfileCreatedEventPayload = EventPayload &
  ColonyProfileCreatedEventArgs;
export type ColonyProfileCreatedEvent = Event<
  typeof PROFILE_CREATED,
  ColonyProfileCreatedEventPayload,
>;

export type ColonyProfileUpdatedEventArgs = {|
  name: string,
  description: string,
  website: string,
  guideline: string,
|};
export type ColonyProfileUpdatedEventPayload = EventPayload &
  ColonyProfileUpdatedEventArgs;

export type ColonyProfileUpdatedEvent = Event<
  typeof PROFILE_UPDATED,
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
