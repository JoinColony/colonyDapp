/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import type { WithKey } from '~types';

import type {
  UniqueActionType,
  ErrorActionType,
  ActionTypeWithPayloadAndMeta,
} from '../index';

import { ACTIONS } from '../../index';
import type { UserActivityType } from '~immutable';

export type UserActivitiesActionTypes = {|
  USER_ACTIVITIES_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_ACTIVITIES_FETCH,
    {|
      colonyClient: ColonyClientType,
    |},
    {|
      id: string,
      key: *,
      colonyAddress?: string,
    |},
  >,
  USER_ACTIVITIES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_ERROR,
    WithKey,
  >,
  USER_ACTIVITIES_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS,
    {|
      activities: UserActivityType[],
    |},
    {|
      id: string,
      key: *,
      colonyAddress?: string,
    |},
  >,
  USER_ACTIVITIES_ADD: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD,
    {|
      activity: *,
      address: string,
    |},
    WithKey,
  >,
  USER_ACTIVITIES_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD_ERROR,
    WithKey,
  >,
  USER_ACTIVITIES_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD_SUCCESS,
    {|
      activity: UserActivityType,
    |},
    WithKey,
  >,
|};
