/* @flow */
import type { WithKey } from '~types';

import type { UniqueActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';
import type { UserActivityType } from '~immutable';

export type UserActivitiesActionTypes = {|
  USER_ACTIVITIES_FETCH: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH,
    {|
      address: string,
    |},
    WithKey,
  >,
  USER_ACTIVITIES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_ERROR,
    WithKey,
  >,
  USER_ACTIVITIES_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS,
    {|
      activities: UserActivityType[],
    |},
    WithKey,
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
