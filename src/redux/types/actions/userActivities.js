/* @flow */
import type { ActionType, ErrorActionType, WithKeyPathDepth1 } from '~types';

import { ACTIONS } from '../../index';
import type { UserActivityType } from '~immutable';

export type UserActivitiesActionTypes = {|
  USER_ACTIVITIES_FETCH: ActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH,
    {|
      walletAddress: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_ERROR,
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_FETCH_SUCCESS: ActionType<
    typeof ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS,
    {|
      activities: UserActivityType[],
      walletAddress: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE: ActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE,
    {|
      activity: *,
      walletAddress: string,
    |},
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE_ERROR,
    WithKeyPathDepth1,
  >,
  USER_ACTIVITIES_UPDATE_SUCCESS: ActionType<
    typeof ACTIONS.USER_ACTIVITIES_UPDATE_SUCCESS,
    {|
      activities: UserActivityType[],
    |},
    WithKeyPathDepth1,
  >,
|};
