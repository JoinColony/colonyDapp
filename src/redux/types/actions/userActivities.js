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
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_ADD: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD,
    {|
      activity: *,
      address: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD_ERROR,
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_ADD_SUCCESS,
    {|
      activity: UserActivityType,
    |},
    WithKeyPathDepth1,
  >,
|};
