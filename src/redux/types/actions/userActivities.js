/* @flow */
import type { WithKeyPathDepth1 } from '~types';

import type { UniqueActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';
import type { UserActivityType } from '~immutable';

export type UserActivitiesActionTypes = {|
  USER_ACTIVITIES_FETCH: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH,
    {|
      address: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS,
    {|
      activities: UserActivityType[],
      address: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE,
    {|
      activity: *,
      address: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE_ERROR,
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE_SUCCESS,
    {|
      activities: UserActivityType[],
      address: string,
    |},
    WithKeyPathDepth1,
  >,
|};
