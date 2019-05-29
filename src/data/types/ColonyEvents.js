/* @flow */

import type { ColonyProps } from '~immutable';
import type { EventDefinition } from './events';

import { COLONY_EVENT_TYPES } from '../constants';
import type { Address } from '~types';

const {
  COLONY_AVATAR_REMOVED,
  COLONY_AVATAR_UPLOADED,
  DOMAIN_CREATED,
  COLONY_PROFILE_CREATED,
  COLONY_PROFILE_UPDATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
  TOKEN_INFO_ADDED,
  TOKEN_INFO_REMOVED,
} = COLONY_EVENT_TYPES;

export type ColonyEvents = {|
  COLONY_AVATAR_REMOVED: EventDefinition<
    typeof COLONY_AVATAR_REMOVED,
    {|
      ipfsHash: string,
    |},
  >,
  COLONY_AVATAR_UPLOADED: EventDefinition<
    typeof COLONY_AVATAR_UPLOADED,
    {|
      ipfsHash: string,
    |},
  >,
  DOMAIN_CREATED: EventDefinition<
    typeof DOMAIN_CREATED,
    {|
      domainId: number,
      name: string,
    |},
  >,
  COLONY_PROFILE_CREATED: EventDefinition<
    typeof COLONY_PROFILE_CREATED,
    ColonyProps<{
      colonyAddress: *,
      colonyName: *,
      displayName: *,
    }>,
  >,
  COLONY_PROFILE_UPDATED: EventDefinition<
    typeof COLONY_PROFILE_UPDATED,
    ColonyProps<{
      description: *,
      displayName: *,
      guideline: *,
      website: *,
    }>,
  >,
  TASK_STORE_REGISTERED: EventDefinition<
    typeof TASK_STORE_REGISTERED,
    {|
      commentsStoreAddress: string,
      draftId: string,
      taskStoreAddress: string,
    |},
  >,
  TASK_STORE_UNREGISTERED: EventDefinition<
    typeof TASK_STORE_UNREGISTERED,
    {|
      draftId: string,
      taskStoreAddress: string,
    |},
  >,
  TOKEN_INFO_ADDED: EventDefinition<
    typeof TOKEN_INFO_ADDED,
    {|
      address: Address,
      iconHash?: string,
      isNative?: boolean,
      isExternal?: boolean,
      name?: string,
      symbol?: string,
    |},
  >,
  TOKEN_INFO_REMOVED: EventDefinition<
    typeof TOKEN_INFO_REMOVED,
    {|
      address: Address,
    |},
  >,
|};
