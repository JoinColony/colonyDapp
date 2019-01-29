/* @flow */

import type {
  EventCreator,
  ColonyAvatarUploadedEventArgs,
  ColonyAvatarUploadedEventPayload,
  ColonyAvatarRemovedEventArgs,
  ColonyAvatarRemovedEventPayload,
  DomainCreatedEventArgs,
  DomainCreatedEventPayload,
  ColonyProfileCreatedEventArgs,
  ColonyProfileCreatedEventPayload,
  ColonyProfileUpdatedEventArgs,
  ColonyProfileUpdatedEventPayload,
  TaskStoreCreatedEventArgs,
  TaskStoreCreatedEventPayload,
  TokenInfoAddedEventArgs,
  TokenInfoAddedEventPayload,
} from './types';

import { decoratePayload } from './utils';
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

// @TODO add payload validation here like we had in beta events
export const createDomainCreatedEvent: EventCreator<
  DomainCreatedEventArgs,
  DomainCreatedEventPayload,
> = ({ domainId }) => ({
  type: DOMAIN_CREATED,
  payload: decoratePayload<DomainCreatedEventPayload>({
    domainId,
  }),
});
export const createTaskStoreCreatedEvent: EventCreator<
  TaskStoreCreatedEventArgs,
  TaskStoreCreatedEventPayload,
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
  ColonyAvatarRemovedEventPayload,
> = ({ ipfsHash }) => ({
  type: AVATAR_REMOVED,
  payload: decoratePayload<ColonyAvatarRemovedEventPayload>({ ipfsHash }),
});

export const createColonyAvatarUploadedEvent: EventCreator<
  ColonyAvatarUploadedEventArgs,
  ColonyAvatarUploadedEventPayload,
> = ({ ipfsHash, avatar }) => ({
  type: AVATAR_UPLOADED,
  payload: decoratePayload<ColonyAvatarUploadedEventPayload>({
    avatar,
    ipfsHash,
  }),
});

export const createColonyProfileCreatedEvent: EventCreator<
  ColonyProfileCreatedEventArgs,
  ColonyProfileCreatedEventPayload,
> = ({
  colonyId,
  address,
  ensName,
  name,
  description,
  website,
  guideline,
}) => ({
  type: PROFILE_CREATED,
  payload: decoratePayload<ColonyProfileCreatedEventPayload>({
    colonyId,
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
  ColonyProfileUpdatedEventPayload,
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
  TokenInfoAddedEventPayload,
> = ({ address, icon, name, symbol }) => ({
  type: TOKEN_INFO_ADDED,
  payload: decoratePayload<TokenInfoAddedEventPayload>({
    address,
    icon,
    name,
    symbol,
  }),
});
