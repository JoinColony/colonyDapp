/* @flow */

import type { ColonyProps } from '~immutable';
import type { EventDefinition } from './events';

import { COLONY_EVENT_TYPES } from '../constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_CREATED,
  PROFILE_UPDATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

export type ColonyEvents = {|
  AVATAR_REMOVED: EventDefinition<
    typeof AVATAR_REMOVED,
    {|
      ipfsHash: string,
    |},
  >,
  AVATAR_UPLOADED: EventDefinition<
    typeof AVATAR_UPLOADED,
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
  PROFILE_CREATED: EventDefinition<
    typeof PROFILE_CREATED,
    ColonyProps<{
      colonyAddress: *,
      description: *,
      colonyName: *,
      guideline: *,
      displayName: *,
      website?: *,
    }>,
  >,
  PROFILE_UPDATED: EventDefinition<
    typeof PROFILE_UPDATED,
    ColonyProps<{
      description: *,
      guideline: *,
      displayName: *,
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
      address: string,
      icon?: string,
      isNative?: boolean,
      name: string,
      symbol: string,
    |},
  >,
|};
