/* @flow */

import type {
  ActionType,
  ActionTypeWithPayload,
  ErrorActionType,
} from '../index';

import { ACTIONS } from '../../index';

export type ConnectionActionTypes = {|
  CONNECTION_STATS_SUB_ERROR: ErrorActionType<
    typeof ACTIONS.CONNECTION_STATS_SUB_ERROR,
  >,
  CONNECTION_STATS_SUB_EVENT: ActionTypeWithPayload<
    typeof ACTIONS.CONNECTION_STATS_SUB_EVENT,
    {|
      ping: number,
      pinners: string[],
      pinnerBusy: string[],
      pubsubPeers: string[],
      swarmPeers: string[],
    |},
  >,
  CONNECTION_STATS_SUB_START: ActionType<
    typeof ACTIONS.CONNECTION_STATS_SUB_START,
  >,
  CONNECTION_STATS_SUB_STOP: ActionType<
    typeof ACTIONS.CONNECTION_STATS_SUB_STOP,
  >,
|};
